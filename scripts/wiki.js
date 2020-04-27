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

    for (let i = 0; i < text.length; i++) {
        if (text[i].startsWith("#")) {
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

    for (let j = 0; j < sections.length; j++) {

        var body = document.createElement("div");
        body.setAttribute("class", "message-body");

        for (let k = 0; k < texts[j].length; k++) {

            var textLine = document.createElement("p");
            textLine.innerHTML = texts[j][k];

            body.appendChild(textLine);
        }

        sections[j].appendChild(body);
        parent.appendChild(sections[j]);
    }

    updateHTML("wikicontent", parent);
}

function readTextFile(language, category, page) {
    console.log(`https://raw.githubusercontent.com/NeusFear/fabric-wiki/master/wikipages/${language}/${category}/${page}.md`);
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