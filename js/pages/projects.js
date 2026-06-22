import { db } from "../firebase/firebase-config.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function initProjects() {

    const projectsGrid =
        document.getElementById("projects-grid");

    if (!projectsGrid) return;

    try {

        const projectsRef =
            collection(db, "projects");

        const projectsQuery =
            query(
                projectsRef,
                orderBy("order", "asc")
            );

        const snapshot =
            await getDocs(projectsQuery);

        projectsGrid.innerHTML = "";

        if (snapshot.empty) {

            projectsGrid.innerHTML = `
                <div class="projects-empty">
                    No projects found.
                </div>
            `;

            return;
        }

        snapshot.forEach(doc => {

            const project = doc.data();

            const technologies =
                project.technologies || [];

            const techBadges =
                technologies.map(tech => `
                    <span class="tech-badge">
                        ${tech}
                    </span>
                `).join("");

            projectsGrid.innerHTML += `
            
                <div class="project-card">

                    <div class="project-image">
                        <img
                            src="${project.imageUrl}"
                            alt="${project.title}">
                    </div>

                    <div class="project-content">

                        <h3 class="project-title">
                            ${project.title}
                        </h3>

                        <p class="project-description">
                            ${project.description}
                        </p>

                        <div class="project-tech">
                            ${techBadges}
                        </div>

                        <div class="project-links">

                            ${
                                project.githubUrl
                                    ? `
                                    <a
                                        href="${project.githubUrl}"
                                        target="_blank"
                                        class="project-btn github-btn">

                                        <i class="fab fa-github"></i>
                                        GitHub
                                    </a>
                                `
                                    : ""
                            }

                            ${
                                project.liveDemoUrl
                                    ? `
                                    <a
                                        href="${project.liveDemoUrl}"
                                        target="_blank"
                                        class="project-btn demo-btn">

                                        <i class="fas fa-arrow-up-right-from-square"></i>
                                        Live Demo
                                    </a>
                                `
                                    : ""
                            }

                        </div>

                    </div>

                </div>

            `;
        });

    } catch (error) {

        console.error(
            "Failed to load projects:",
            error
        );

        projectsGrid.innerHTML = `
            <div class="projects-empty">
                Failed to load projects.
            </div>
        `;
    }
}