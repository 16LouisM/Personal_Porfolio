import { db } from "../firebase-config.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let modal;

/**
 * INIT PROJECTS
 */
export async function initProjects() {

    const projectsGrid = document.getElementById("projects-grid");

    if (!projectsGrid) return;

    modal = document.getElementById("projectModal");

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

            const card = document.createElement("article");
            card.className = "project-card";

            const technologies = project.technologies || [];

            const techBadges = technologies
                .map(tech => `<span class="tech-badge">${tech}</span>`)
                .join("");

            card.innerHTML = `
                <div class="project-image">
                    <img src="${project.imageUrl}" alt="${project.name}" loading="lazy">
                </div>

                <div class="project-content">

                    <h3 class="project-title">${project.name}</h3>

                    <p class="project-description">${project.description}</p>

                    <div class="project-tech">
                        ${techBadges}
                    </div>

                    <div class="project-links">

                        <a href="${project.projectUrl}" target="_blank"
                           rel="noopener noreferrer"
                           class="project-btn demo-btn">

                            <i class="fas fa-arrow-up-right-from-square"></i>
                            View Project
                        </a>

                        <button class="project-btn details-btn">
                            <i class="fas fa-info-circle"></i>
                            Details
                        </button>

                    </div>

                </div>
            `;

            // OPEN MODAL
            const detailsBtn = card.querySelector(".details-btn");

            detailsBtn.addEventListener("click", () => {
                openProjectModal(project);
            });

            projectsGrid.appendChild(card);
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

/**
 * OPEN MODAL
 */
function openProjectModal(project) {

    if (!modal) return;

    modal.classList.remove("hidden");

    // Title + text
    document.getElementById("modalTitle").textContent =
        project.name || "Untitled Project";

    document.getElementById("modalSubtitle").textContent =
        project.subtitle || "";

    document.getElementById("modalDescription").textContent =
        project.description || "";

    // ===== GALLERY =====
    const gallery = document.getElementById("modalGallery");
    gallery.innerHTML = "";

    const images = project.images?.length
        ? project.images
        : [project.imageUrl];

    images.forEach(img => {
        const image = document.createElement("img");
        image.src = img;
        image.alt = project.name;
        gallery.appendChild(image);
    });

    // ===== TECH STACK =====
    const techStack = document.getElementById("modalTechStack");
    techStack.innerHTML = "";

    (project.technologies || []).forEach(tech => {
        const span = document.createElement("span");
        span.textContent = tech;
        techStack.appendChild(span);
    });

    // ===== FEATURES =====
    const featuresList = document.getElementById("modalFeatures");
    featuresList.innerHTML = "";

    (project.features || []).forEach(feature => {
        const li = document.createElement("li");
        li.textContent = feature;
        featuresList.appendChild(li);
    });
}

/**
 * CLOSE MODAL
 */
function closeModal() {
    if (!modal) return;
    modal.classList.add("hidden");
}

/**
 * EVENT LISTENERS
 */
document.addEventListener("DOMContentLoaded", () => {

    const closeBtn = document.getElementById("closeModalBtn");

    closeBtn?.addEventListener("click", closeModal);

    // click outside modal closes it
    modal?.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC key closes modal
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    });
});