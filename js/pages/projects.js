import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function initProjects() {

    const projectsGrid = document.getElementById("projects-grid");

    if (!projectsGrid) return;

    try {

        const projectsRef = collection(db, "projects");

        const projectsQuery = query(
            projectsRef,
            orderBy("order", "asc")
        );

        const snapshot = await getDocs(projectsQuery);

        projectsGrid.innerHTML = "";

        if (snapshot.empty) {

            projectsGrid.innerHTML = `
                <div class="projects-empty">
                    <h3>No Projects Found</h3>
                    <p>Projects will appear here once they are added.</p>
                </div>
            `;

            return;
        }

        snapshot.forEach((doc) => {

            const project = doc.data();

            const technologies = project.technologies || [];

            const techBadges = technologies
                .map(
                    (tech) => `
                    <span class="tech-badge">
                        ${tech}
                    </span>
                `
                )
                .join("");

            projectsGrid.innerHTML += `
                <article class="project-card">

                    <div class="project-image">

                        <img
                            src="${project.imageUrl}"
                            alt="${project.name}"
                            loading="lazy">

                    </div>

                    <div class="project-content">

                        <h3 class="project-title">
                            ${project.name}
                        </h3>

                        <p class="project-description">
                            ${project.description}
                        </p>

                        <div class="project-tech">
                            ${techBadges}
                        </div>

                        <div class="project-links">

                            <a
                                href="${project.projectUrl}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="project-btn demo-btn">

                                <i class="fas fa-arrow-up-right-from-square"></i>
                                View Project

                            </a>

                        </div>

                    </div>

                </article>
            `;
        });

    } catch (error) {

        console.error("Failed to load projects:", error);

        projectsGrid.innerHTML = `
            <div class="projects-empty">
                <h3>Unable to Load Projects</h3>
                <p>Please try again later.</p>
            </div>
        `;
    }
}