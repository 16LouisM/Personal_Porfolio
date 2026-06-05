import { loadNavbar } from "./modules/navbar.js";
import { initializeTheme } from "./modules/theme.js";
import { initializeAnimations } from "./modules/animations.js";

document.addEventListener("DOMContentLoaded", async () => {

    await loadNavbar();

    initializeTheme();

    initializeAnimations();

});