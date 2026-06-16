import { loadNavbar } from "./modules/navbar.js";
import { initializeTheme } from "./modules/theme.js";
import { initializeAnimations } from "./modules/animations.js";
import { loadProfile } from "./modules/profile.js";
import { initializeTyping } from "./modules/typing.js";
import { initAboutPage } from "./pages/about.js";

try {
  await loadNavbar();
} catch (e) {
  console.error("Navbar failed:", e);
}

initializeTheme();
initializeAnimations();
initializeTyping();

await loadProfile();

// ⚠️ isolate About so it doesn't break everything
try {
  await initAboutPage();
} catch (e) {
  console.error("About section failed:", e);
}