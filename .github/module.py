import re

regex = r"(module\s*=\s*\"(.+?)\").*?>"

def readFile(file):
    return open(file, 'r').read()

def replaceModules(text):
    while True:
        match = re.search(regex, text, re.MULTILINE | re.DOTALL)
        if match == None:
            return text
        text = text[:match.end()] + readFile(match.group(2)) + text[match.end():]
        text = text[:match.start(1)] + text[match.end(1):]

def replaceFile(name):
    text = replaceModules(readFile(name))
    
    file = open(name, 'w')
    file.write(text)
    file.close()
    
    print(text)
    
replaceFile('index.html')
