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
        console.log(text[i]);
        if (text[i].startsWith("#")) {
            //start a new section
            var section = document.createElement("div");
            section.setAttribute("class", "message is-dark");
            
            var title = document.createElement("div");
            title.setAttribute("class", "message-header");
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

function readTextFile() {
    fetch("https://neusfear.github.io/fabric-wiki/wikipages/index.md")
    .then(response => response.text())
    .then((data) => {
        getMarkdown(data);
    })
}

function getFileStructureFromRepo() {
    xmlhttp = getXMLType();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            var jsonResult = JSON.parse(xmlhttp.responseText)
            var pages = new Array();

            jsonResult.forEach(element => {
                if (element.type === "dir") {
                    pages.push(element.name);
                }
            });

            updateContent("wikisidebar", pages.toString());
        }
    }
    xmlhttp.open("GET", "https://api.github.com/repos/NeusFear/fabric-wiki/contents/wikipages/", false );
    xmlhttp.send();  
}