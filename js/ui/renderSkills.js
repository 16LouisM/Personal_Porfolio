/**
 * Renders skills into the given container, grouped by category, with animated bars.
 * @param {string} containerId - ID of the container element.
 * @param {Array} skills - Array of skill objects (each with category, name, level, icon).
 * @param {number} animationDelay - Delay in ms before animating bars (default 200).
 */
export function renderSkills(containerId, skills, animationDelay = 200) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found.`);
        return;
    }

    if (!skills || skills.length === 0) {
        container.innerHTML = "<p>No skills found.</p>";
        return;
    }

    // Group skills by category
    const grouped = {};
    skills.forEach(skill => {
        const category = skill.category || "Other";
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(skill);
    });

    // Build HTML
    let html = "";
    Object.keys(grouped).forEach(category => {
        html += `<div class="skill-category"><h3>${category}</h3>`;

        grouped[category].forEach(skill => {
            const icon = skill.icon || "fa-solid fa-code";
            const level = skill.level || 0;
            html += `
                <div class="skill-item">
                    <div class="skill-info">
                        <div class="skill-header">
                            <i class="${icon} skill-icon"></i>
                            <span class="skill-name">${skill.name}</span>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-bar-fill" data-level="${level}"></div>
                        </div>
                    </div>
                    <span class="skill-level">${level}%</span>
                </div>
            `;
        });

        html += `</div>`;
    });

    container.innerHTML = html;

    // Animate bars after a short delay
    setTimeout(() => {
        document.querySelectorAll(".skill-bar-fill").forEach(bar => {
            const level = Number.parseInt(bar.dataset.level, 10) || 0;
            bar.style.width = level + "%";
        });
    }, animationDelay);
}