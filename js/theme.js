
let linkTheme = null;
let head = document.getElementsByTagName("head")[0];

let isMainPage = false;
if (document.body.children[0].getAttribute('src') === 'js/theme.js') {
    isMainPage = true;
}
function resolvePath(path) {
    return (isMainPage ? '' : '../../') + path;
}
function setTheme(themeName) {
    if (linkTheme) {
        head.removeChild(linkTheme);
    }
    linkTheme = document.createElement("link");
    linkTheme.rel = "stylesheet";
    linkTheme.id = "theme";
    linkTheme.type = "text/css";
    linkTheme.href = resolvePath(`css/theme/${themeName}.css`);
    head.appendChild(linkTheme);
}
const defaultTheme = "beige";
let savedTheme = localStorage.getItem("theme");
if (savedTheme !== null) {
    setTheme(savedTheme);
} else {
    setTheme(defaultTheme);
    localStorage.setItem("theme", defaultTheme);
    savedTheme = defaultTheme;
}

document.addEventListener("DOMContentLoaded", function () {
    let selectedTheme = document.getElementById("selected-theme");
    let hiddenPanel = document.getElementById("hidden-bar");
    selectedTheme.addEventListener("click", function (e) {
        hiddenPanel.classList.toggle("invisible");
        e.stopPropagation();
    });

    selectedTheme.classList.add("theme-" + savedTheme);
    let themes = document.querySelectorAll("#hidden-bar .theme-circle");
    for (let theme of themes) {
        theme.addEventListener("click", function(e) {
            setTheme(theme.dataset.theme);
            localStorage.setItem("theme", theme.dataset.theme);
            selectedTheme.classList.replace("theme-" + savedTheme, "theme-" + theme.dataset.theme);
            savedTheme = theme.dataset.theme;
            e.stopPropagation();
        });
    }
    document.addEventListener("click", function() {
        if (!hiddenPanel.classList.contains("invisible")) {
            hiddenPanel.classList.add("invisible");
        }
    });
    hiddenPanel.addEventListener("click", (e) => e.stopPropagation());
});
