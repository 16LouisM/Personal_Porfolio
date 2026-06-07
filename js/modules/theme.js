// js/modules/theme.js

export function initializeTheme() {

    const body = document.body;
    const themeToggle = document.querySelector("#theme-toggle");

    if (!themeToggle) {
        console.log("✅ Theme initialized (no toggle button found)");
        return;
    }

    const savedTheme = localStorage.getItem("theme") || "dark";

    body.dataset.theme = savedTheme;

    themeToggle.addEventListener("click", () => {

        const currentTheme = body.dataset.theme;
        const newTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";

        body.dataset.theme = newTheme;

        localStorage.setItem("theme", newTheme);

    });

    console.log("✅ Theme initialized");
}