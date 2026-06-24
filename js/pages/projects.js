import { db } from "../firebase-config.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let modal;

/* INIT */
export async function initProjects() {

    const projectsGrid = document.getElementById("projects-grid");
    if (!projectsGrid) return;

    modal = document.getElementById("projectModal");

    try {

        const snapshot = await getDocs(
            query(collection(db, "projects"), orderBy("order", "asc"))
        );

        projectsGrid.innerHTML = "";

        if (snapshot.empty) {
            projectsGrid.innerHTML = `
                <div class="projects-empty">
                    <h3>No Projects Found</h3>
                </div>
            `;
            return;
        }

        snapshot.forEach((doc) => {

            const project = doc.data();

            const card = document.createElement("article");
            card.className = "project-card";

            const techBadges = (project.technologies || [])
                .map(t => `<span class="tech-badge">${t}</span>`)
                .join("");

            card.innerHTML = `
                <div class="project-image">
                    <img src="${project.imageUrl}" alt="${project.name}">
                </div>

                <div class="project-content">

                    <h3 class="project-title">${project.name}</h3>

                    <p class="project-description">${project.description}</p>

                    <div class="project-tech">
                        ${techBadges}
                    </div>

                    <div class="project-links">

                        <a class="project-btn demo-btn"
                           href="${project.projectUrl}"
                           target="_blank">
                           View
                        </a>

                        <button class="project-btn details-btn">
                            Details
                        </button>

                    </div>

                </div>
            `;

            card.querySelector(".details-btn")
                .addEventListener("click", () => openProjectModal(project));

            projectsGrid.appendChild(card);
        });

    } catch (err) {
        console.error(err);
    }
}

/* OPEN MODAL */
function openProjectModal(project) {

    const modal = document.getElementById("projectModal");

    modal.classList.add("show");

    document.getElementById("modalTitle").textContent = project.name || "";
    document.getElementById("modalSubtitle").textContent = project.subtitle || "";
    document.getElementById("modalDescription").textContent = project.description || "";

    /* Gallery */
    const gallery = document.getElementById("modalGallery");
    gallery.innerHTML = "";

    const images = project.images?.length
        ? project.images
        : [project.imageUrl];

    images.forEach(img => {
        const el = document.createElement("img");
        el.src = img;
        gallery.appendChild(el);
    });

    /* Tech */
    const tech = document.getElementById("modalTechStack");
    tech.innerHTML = "";

    (project.technologies || []).forEach(t => {
        const span = document.createElement("span");
        span.textContent = t;
        tech.appendChild(span);
    });

    /* Features */
    const features = document.getElementById("modalFeatures");
    features.innerHTML = "";

    (project.features || []).forEach(f => {
        const li = document.createElement("li");
        li.textContent = f;
        features.appendChild(li);
    });
}

/* CLOSE MODAL */
function closeModal() {
    const modal = document.getElementById("projectModal");
    modal.classList.remove("show");
}

/* EVENTS */
document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("projectModal");
    const closeBtn = document.getElementById("closeModalBtn");

    closeBtn?.addEventListener("click", closeModal);

    modal?.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });
});