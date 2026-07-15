import {
    fetchAboutText,
    fetchStats,
    fetchExperience,
    fetchEducation
} from "../services/aboutService.js";
import {
    renderAboutText,
    renderStats,
    renderExperience,
    renderEducation
} from "../ui/renderAbout.js";

export async function initAboutPage() {
    // Check if about section exists in DOM
    if (!document.getElementById("about")) {
        return;
    }

    try {
        // Fetch all data concurrently
        const [aboutData, stats, experiences, educations] = await Promise.all([
            fetchAboutText(),
            fetchStats(),
            fetchExperience(),
            fetchEducation()
        ]);

        // Render all sections
        renderAboutText(aboutData);
        renderStats(stats);
        renderExperience("experience-list", experiences);
        renderEducation("education-list", educations);

    } catch (error) {
        console.error("Error loading About section:", error);
        // Optionally show a fallback message in the UI
    }
}