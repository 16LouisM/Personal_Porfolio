// js/modules/theme.js

export function initializeTheme() {
    const body = document.body;
    const themeToggle = document.querySelector("#theme-toggle");

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
        body.classList.add("theme-transition");

        setTimeout(() => {
            body.classList.remove("theme-transition");
        }, 300);
    }
}