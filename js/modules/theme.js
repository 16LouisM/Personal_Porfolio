// js/modules/theme.js

export function initializeTheme() {

    const body = document.body;
    const themeToggle = document.querySelector("#theme-toggle");
    const themeIcon = document.querySelector("#theme-icon");

    const savedTheme = localStorage.getItem("theme") || "dark";

    applyTheme(savedTheme);

    if (!themeToggle) return;

    themeToggle.addEventListener("click", () => {
        const newTheme = body.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    });

    function applyTheme(theme) {
        body.dataset.theme = theme;

        updateIcon(theme);
    }

    function updateIcon(theme) {
        if (!themeIcon) return;

        if (theme === "dark") {
            // DARK MODE → SUN ICON ☀️
            themeIcon.className = "fa-solid fa-sun";
        } else {
            // LIGHT MODE → HALF MOON 🌙
            themeIcon.className = "fa-solid fa-moon";
        }
    }
}