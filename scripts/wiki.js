function updateContent(id, responsetext) {
    document.getElementById(id).innerText = responsetext;
}

function updateHTML(id, element) {
    document.getElementById(id).replaceWith(element);
}

function getXMLType() {
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        return new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function getMarkdown(data) {
    var text = data.split("\n");

    var parent = document.createElement("div");
    parent.setAttribute("class", "container");

    var sections = new Array();
    var texts = new Array();

    //Defines sections of the article
    for (let i = 0; i < text.length; i++) {
        if (text[i].startsWith("# ")) {
            //start a new section
            var section = document.createElement("div");
            section.setAttribute("class", "message is-dark");
            
            var title = document.createElement("div");
            title.setAttribute("class", "message-header subtitle");
            title.innerText = text[i].substring(1);

            section.appendChild(title);
            sections.push(section);

            //starts a new array for subsequent texts under this section
            texts.push(new Array());
        } else {
            //add text to current section ignoring empty lines
            if (text.length != 0) {
                texts[texts.length - 1].push(text[i]);
            }
        }
    }

    //Begins parsing the lines of the content of the articles
    for (let j = 0; j < sections.length; j++) {

        //Create the container for article section content
        var body = document.createElement("div");
        body.setAttribute("class", "message-body");

        //If true there will be nothing appended to the body at the end of parsing
        var skipAppend = false;

        //Stores table info and build status
        var tableGroup = false;
        var tableHasHead = true;
        var currentTable = [];

        //Start looping through the lines of the section
        for (let k = 0; k < texts[j].length; k++) {
            var textLine; 

            console.log(texts[j][k]);

            //heading sizes
            if (texts[j][k].startsWith("## ")) {
                textLine = document.createElement("div");
                textLine.setAttribute("class", "subtitle is-2");
                texts[j][k] = texts[j][k].substring(2);
                textLine.innerHTML = texts[j][k];
            } else if (texts[j][k].startsWith("### ")) {
                textLine = document.createElement("div");
                textLine.setAttribute("class", "subtitle is-3");
                texts[j][k] = texts[j][k].substring(3);
                textLine.innerHTML = texts[j][k];
            } else if (texts[j][k].startsWith("#### ")) {
                textLine = document.createElement("div");
                textLine.setAttribute("class", "subtitle is-4");
                texts[j][k] = texts[j][k].substring(4);
                textLine.innerHTML = texts[j][k];
            } else if (texts[j][k].startsWith("##### ")) {
                textLine = document.createElement("div");
                textLine.setAttribute("class", "subtitle is-5");
                texts[j][k] = texts[j][k].substring(5);
                textLine.innerHTML = texts[j][k];
            } else {
                textLine = document.createElement("p");
                textLine.innerHTML = texts[j][k];
            }

            //tables
            if (texts[j][k].startsWith("|")) {
                let tableCurrentLine = texts[j][k].split("|");
                tableCurrentLine.shift();
                tableCurrentLine.pop();
                skipAppend = true;

                //Add a row to the table
                //Sort out alignments
                if (tableCurrentLine[1].startsWith("-") || tableCurrentLine[1].startsWith(":")) {
                    for (let sections = 0; sections < tableCurrentLine.length; sections++) {
                        if (tableCurrentLine[sections].startsWith(":")) {
                            if (tableCurrentLine[sections].endsWith(":")) {
                                tableCurrentLine[sections] = "center";
                            } else {
                                tableCurrentLine[sections] = "left";
                            }
                        }
                        if (tableCurrentLine[sections].startsWith("-") && tableCurrentLine[sections].endsWith(":")) {
                            tableCurrentLine[sections] = "right";
                        }
                    }
                    currentTable.unshift(tableCurrentLine);
                } else {
                    currentTable.push(tableCurrentLine);
                }

                //if this is the last line of the table, end it
                if (!texts[j][k + 1].startsWith("|")) {
                    //Build the html
                    textLine = document.createElement("table");
                    textLine.setAttribute("class", "table is-bordered");
                    var thead = document.createElement("thead");
                    var tbody = document.createElement("tbody");
                    for (let l = 1; l < currentTable.length; l++) {

                        var row = document.createElement("tr");
                        for (let m = 0; m < currentTable[l].length; m++) {
                            let cell = document.createElement("td");
                            cell.style.textAlign = currentTable[0][m];
                            cell.innerText = currentTable[l][m];
                            row.appendChild(cell);
                        }
                        //Add and style head and body elements of the table
                        if (tableHasHead && l === 1) {
                            row.setAttribute("class", "has-background-dark");
                            row.childNodes.forEach(child => {
                                child.classList.toggle("has-text-light");
                            });
                            thead.appendChild(row);
                        } else {
                            tbody.appendChild(row);
                        }
                    }

                    //Append the head and body components
                    if (tableHasHead) {
                        textLine.appendChild(thead);
                    }
                    textLine.appendChild(tbody);

                    //Tell the append bit that the table html is ready to append to the section
                    tableGroup = false;
                    skipAppend = false;
                }
            }
            
            //Add the progress to the section content
            if (!skipAppend) {
                body.appendChild(textLine);

                //reset table storage
                currentTable = [];
                tableHasHead = true;
            }
        }

        sections[j].appendChild(body);
        parent.appendChild(sections[j]);
    }

    updateHTML("wikicontent", parent);
}

function readTextFile(language, category, page) {
    fetch(`https://raw.githubusercontent.com/NeusFear/fabric-wiki/master/wikipages/${language}/${category}/${page}.md`)
    .then(response => response.text())
    .then((data) => {
        getMarkdown(data);
    })
}

function parsePageList(data, category, page) {
    
    var parent = document.createElement("article");
    parent.setAttribute("class", "panel is-primary");

    var title = document.createElement("p");
    title.setAttribute("class", "panel-heading");

    var titleText = document.createElement("p");
    titleText.innerHTML = "Pages";

    title.appendChild(titleText);

    parent.appendChild(title);

    var jsonData = JSON.parse(data);
    for (let i = 0; i < jsonData.categories.length; i++) {

        var section = document.createElement("a");
        var icon = document.createElement("span");
        var iconImage = document.createElement("i");
        icon.setAttribute("class", "panel-icon");

        if (category == jsonData.categories[i].name) {
            section.setAttribute("class", "panel-block is-capitalized is-active");
            iconImage.setAttribute("class", "fas fa-angle-down");
        } else {
            section.setAttribute("class", "panel-block is-capitalized");
            iconImage.setAttribute("class", "fas fa-angle-right");
        }

        var name = document.createElement("p");
        name.innerHTML = jsonData.categories[i].name;

        icon.appendChild(iconImage);
        section.appendChild(icon);
        section.appendChild(name);

        parent.appendChild(section);

        //Add the headers of the category to the list of the active section
        if (category == jsonData.categories[i].name) {
            for (let j = 0; j < jsonData.categories[i].pages.length; j++) {
                var subSection = document.createElement("a");
                subSection.setAttribute("class", "panel-block is-capitalized");
                var spacing = document.createElement("div");
                spacing.setAttribute("class", "divider");
                spacing.setAttribute("style", "width: 2rem");
                var subSectionName = document.createElement("p");
                subSectionName.innerText = jsonData.categories[i].pages[j].replace(new RegExp("_".replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), 'g'), " ");

                subSection.appendChild(spacing);
                subSection.appendChild(subSectionName);
                parent.appendChild(subSection);
            }
        }
    }

    updateHTML("wikisidebar", parent);
}

function setupPagesSidebar(language, category, page) {
    fetch(`https://raw.githubusercontent.com/NeusFear/fabric-wiki/master/wikipages/${language}/wiki.json`)
    .then(response => response.text())
    .then((data) => {
        parsePageList(data, category, page);
    })
}