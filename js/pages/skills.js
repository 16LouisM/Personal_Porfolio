import { getSkills } from "../services/skillService.js";
import { renderSkills } from "../ui/renderSkills.js";

/**
 * Initialize the skills section: fetch data and render.
 */
export async function initSkills() {
    const containerId = "skillsWrapper";
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`#${containerId} not found in DOM.`);
        return;
    }

    try {
        const skills = await getSkills();
        renderSkills(containerId, skills);
    } catch (error) {
        console.error("Failed to initialize skills:", error);
        container.innerHTML = "<p>Error loading skills.</p>";
    }
}