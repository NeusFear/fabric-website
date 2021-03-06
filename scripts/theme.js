document.addEventListener('DOMContentLoaded', () => {
    if (isDark()) {
        toggleLook();
    } else if (!isDark() && !isLight()) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            swapTheme();
        }
    }
});

function isDark() {
    return document.cookie.match("theme=dark") != null
}

function isLight() {
    return document.cookie.match("theme=light") != null
}

function swapTheme() {
    document.cookie = 'theme=' + (isDark() ? 'light' : 'dark');
    toggleLook();
}

function toggleLook() {
    elements = document.getElementsByTagName("*");
    for (var i = 0; i < elements.length; i++) {
        if (!elements[i].getAttribute("dont-theme")) {
            if (elements[i].classList.contains("button")) {
                elements[i].classList.toggle("is-inverted");
            } else {
                elements[i].classList.toggle("is-dark");
            }
            if (elements[i].getAttribute("background-themable")) {
                elements[i].classList.toggle("has-background-black-ter");
            }
            if (elements[i].getAttribute("lighten-text-when-dark")) {
                elements[i].classList.toggle("has-text-light");
            }
        }
    }
}