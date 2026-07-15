import { fetchProfile } from "../services/profileService.js";
import { renderProfile } from "../ui/renderProfile.js";

/**
 * Initialize the profile section: load data and update the DOM.
 */
export async function initProfile() {
    try {
        const profile = await fetchProfile();
        renderProfile(profile);
    } catch (error) {
        console.error("Failed to load profile:", error);
        // Optionally show a fallback message in the UI
    }
}