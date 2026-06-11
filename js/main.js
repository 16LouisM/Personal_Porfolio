import { loadNavbar } from "./modules/navbar.js";
import { initializeTheme } from "./modules/theme.js";
import { initializeAnimations } from "./modules/animations.js";
import { loadProfile } from "./modules/profile.js";
import { initializeTyping } from "./modules/typing.js";

document.addEventListener("DOMContentLoaded", async () => {

    await loadNavbar();

    initializeTheme();

    initializeAnimations();

    initializeTyping();

    await loadProfile();

});