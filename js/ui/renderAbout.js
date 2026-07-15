/**
 * Set a data-count attribute on an element.
 * @param {string} id - Element ID.
 * @param {number} value - Count value.
 */
function setCounter(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.dataset.count = value || 0;
    }
}

/**
 * Create HTML for a timeline item.
 * @param {string} title - Main title.
 * @param {string} subtitle - Subtitle (e.g., period or qualification).
 * @param {string} description - Description text.
 * @returns {string} HTML string.
 */
function createTimelineItem(title, subtitle, description) {
    return `
        <div class="timeline-item">
            <h3>${title || ""}</h3>
            <span>${subtitle || ""}</span>
            <p>${description || ""}</p>
        </div>
    `;
}

/**
 * Render about text and image.
 * @param {Object} data - { text, imageUrl }
 */
export function renderAboutText(data) {
    const aboutText = document.getElementById("about-text");
    const journeyImage = document.getElementById("journey-image");
    if (aboutText) {
        // Replace newlines with <br>
        aboutText.innerHTML = (data.text || "").replaceAll("\n", "<br>");
    }
    if (journeyImage) {
        journeyImage.src = data.imageUrl || "";
    }
}

/**
 * Render stats counters.
 * @param {Object} stats - { projects, skills, certificates, experienceYears }
 */
export function renderStats(stats) {
    setCounter("projects-count", stats.projects);
    setCounter("skills-count", stats.skills);
    setCounter("certificates-count", stats.certificates);
    setCounter("experience-years", stats.experienceYears);
}

/**
 * Render experience timeline.
 * @param {string} containerId - ID of the container element.
 * @param {Array} experiences - Array of experience objects.
 */
export function renderExperience(containerId, experiences) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    experiences.forEach(exp => {
        container.innerHTML += createTimelineItem(
            exp.title,
            exp.period,
            exp.description
        );
    });
}

/**
 * Render education timeline.
 * @param {string} containerId - ID of the container element.
 * @param {Array} educations - Array of education objects.
 */
export function renderEducation(containerId, educations) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    educations.forEach(edu => {
        container.innerHTML += createTimelineItem(
            edu.institution,
            edu.qualification,
            edu.description
        );
    });
}