import { loadNavbar } from "./modules/navbar.js";
import { initializeTheme } from "./modules/theme.js";
import { initializeAnimations } from "./modules/animations.js";
import { loadProfile } from "./modules/profile.js";
import { initializeTyping } from "./modules/typing.js";
import { initializeCounters } from "./modules/counter.js";

import { initAboutPage } from "./pages/about.js";
import { initSkills } from "./pages/skills.js";
import { initProjects } from "./pages/projects.js";

// ======================
// INIT APP AFTER DOM READY
// ======================

window.addEventListener("DOMContentLoaded", async () => {

    // UI INIT
    initializeTheme();
    initializeAnimations();
    initializeTyping();

    // NAVBAR
    try {
        await loadNavbar();
    } catch (error) {
        console.error("Navbar failed:", error);
    }

    // PROFILE
    try {
        await loadProfile();
    } catch (error) {
        console.error("Profile failed:", error);
    }

    // ABOUT
    try {
        await initAboutPage();
    } catch (error) {
        console.error("About failed:", error);
    }

    // SKILLS (NOW SAFE)
    try {
        await initSkills();
    } catch (error) {
        console.error("Skills failed:", error);
    }

    
    // PROJECTS
        try {
            await initProjects();
        } catch (error) {
            console.error("Projects failed:", error);
        }
    // COUNTERS
    initializeCounters();
});