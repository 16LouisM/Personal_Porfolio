import { loadNavbar } from "./modules/navbar.js";
import { initializeTheme } from "./modules/theme.js";
import { initializeAnimations } from "./modules/animations.js";
import { loadProfile } from "./modules/profile.js";
import { initializeTyping } from "./modules/typing.js";
import { initializeCounters } from "./modules/counter.js";

import { initAboutPage } from "./pages/about.js";

// ======================
// NAVBAR
// ======================

try {

    await loadNavbar();

} catch (error) {

    console.error(
        "Navbar failed to load:",
        error
    );

}

// ======================
// UI INITIALIZATION
// ======================

initializeTheme();
initializeAnimations();
initializeTyping();

// ======================
// PROFILE
// ======================

try {

    await loadProfile();

} catch (error) {

    console.error(
        "Profile failed to load:",
        error
    );

}

// ======================
// ABOUT SECTION
// ======================

try {

    await initAboutPage();

} catch (error) {

    console.error(
        "About section failed:",
        error
    );

}

// ======================
// COUNTERS
// ======================

initializeCounters();