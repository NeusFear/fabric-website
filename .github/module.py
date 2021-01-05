import re

regex = r"(module\s*=\s*\"(.+?)\").*?>"

def readFile(file):
    return open(file, 'r').read()

def replaceModules(text):
    while True:
        match = re.search(regex, text, re.MULTILINE | re.DOTALL)
        if match == None:
            return text
        text = text[:match.end()] + open(match.group(2), "r") + text[match.end():]
        text = text[:match.start(1)] + text[match.end(1):]

def replaceFile(name):
    text = replaceModules(readFile(name))
    
    file = open(name, 'w')
    file.write(text)
    file.close()
    
replaceFile('index.html')
