export function initializeTheme() {

    const body = document.body;
    const themeToggle = document.querySelector("#theme-toggle");
    const themeIcon = document.querySelector("#theme-icon");

    const savedTheme = localStorage.getItem("theme");

    // 1. Detect system theme if no saved preference
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    const initialTheme = savedTheme || systemTheme;

    applyTheme(initialTheme);

    if (!themeToggle) return;

    // 2. Toggle theme manually
    themeToggle.addEventListener("click", () => {

        const newTheme = body.dataset.theme === "dark"
            ? "light"
            : "dark";

        applyTheme(newTheme);

        // Save user override
        localStorage.setItem("theme", newTheme);
    });

    // 3. Apply theme function
    function applyTheme(theme) {
        body.dataset.theme = theme;
        updateIcon(theme);
    }

    // 4. Update icon
    function updateIcon(theme) {
        if (!themeIcon) return;

        if (theme === "dark") {
            themeIcon.className = "fa-solid fa-sun";
        } else {
            themeIcon.className = "fa-solid fa-moon";
        }
    }

    // 5. Listen for system theme changes (LIVE SWITCH)
    window.matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {

            // Only auto-switch if user has NOT manually set theme
            const hasSaved = localStorage.getItem("theme");

            if (hasSaved) return;

            const newTheme = e.matches ? "dark" : "light";
            applyTheme(newTheme);
        });
}