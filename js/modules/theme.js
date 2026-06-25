export function initializeTheme() {

    const body = document.body;
    const themeToggle = document.querySelector("#theme-toggle");
    const themeIcon = document.querySelector("#theme-icon");





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
}