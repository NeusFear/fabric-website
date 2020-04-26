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

function getMarkdownFrom(theUrl) {
    xmlhttp = getXMLType();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            console.log(xmlhttp.responseText);

            var text = xmlhttp.responseText.split("\n");

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
                    title.setAttribute("class", "message-header");
                    title.innerText = text[i].substring(1);

                    section.appendChild(title);
                    sections.push(section);

                    //starts a new array for subsequent texts under this section
                    texts.push(new Array());
                } else {
                    //add text to current section
                    texts[texts.length - 1].push(text[i]);
                }
            }

            for (let j = 0; j < sections.length; j++) {
    
                var body = document.createElement("div");
                body.setAttribute("class", "message-body");

                for (let k = 0; k < texts.length; k++) {
                    body.innerText = body.innerText + "\n" + texts[j][k];
                }
    
                sections[j].appendChild(body);
                parent.appendChild(sections[j]);
            }

            updateHTML("wikicontent", parent);
        }
    }
    xmlhttp.open("GET", theUrl, false );
    xmlhttp.send();    
}

function readTextFile() {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "wiki/wikipages/index.md", false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}

function getFileStructureFromRepo() {
    xmlhttp = getXMLType();
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {

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