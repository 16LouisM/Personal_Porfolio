import { db } from "../firebase-config.js";
import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function initSkills() {

    const skillsWrapper = document.getElementById("skillsWrapper");

    if (!skillsWrapper) {
        console.error("skillsWrapper not found in DOM");
        return;
    }

    try {

        const snapshot = await getDocs(collection(db, "skills"));

        if (snapshot.empty) {
            skillsWrapper.innerHTML = "<p>No skills found in Firebase.</p>";
            return;
        }

        const grouped = {};

        snapshot.forEach(doc => {
            const data = doc.data();

            if (!grouped[data.category]) {
                grouped[data.category] = [];
            }

            grouped[data.category].push(data);
        });

        skillsWrapper.innerHTML = "";

        Object.keys(grouped).forEach(category => {

            const categoryDiv = document.createElement("div");
            categoryDiv.className = "skill-category";

            let skillsHTML = `<h3>${category}</h3>`;

            grouped[category].forEach(skill => {

                skillsHTML += `
                    <div class="skill-item">

                        <div class="skill-info">

                            <div class="skill-header">

                                <i class="${skill.icon || 'fa-solid fa-code'} skill-icon"></i>

                                <span class="skill-name">
                                    ${skill.name}
                                </span>

                            </div>

                            <div class="skill-bar">
                                <div class="skill-bar-fill"
                                    data-level="${skill.level}">
                                </div>
                            </div>

                        </div>

                        <span class="skill-level">
                            ${skill.level}%
                        </span>

                    </div>
                `;
            });

            categoryDiv.innerHTML = skillsHTML;
            skillsWrapper.appendChild(categoryDiv);
        });

        // Animate bars
        setTimeout(() => {
            document.querySelectorAll(".skill-bar-fill").forEach(bar => {
                bar.style.width = bar.dataset.level + "%";
            });
        }, 200);

    } catch (error) {
        console.error("Error loading skills:", error);
        skillsWrapper.innerHTML = "<p>Error loading skills.</p>";
    }
}