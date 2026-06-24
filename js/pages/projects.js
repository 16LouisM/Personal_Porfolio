import { db } from "../firebase-config.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =========================
   GLOBAL STATE
========================= */

let modal;
let zoomOverlay;
let zoomImage;

/* =========================
   INIT PROJECTS
========================= */

export async function initProjects() {

    const projectsGrid = document.getElementById("projects-grid");
    if (!projectsGrid) return;

    modal = document.getElementById("projectModal");

    // init zoom system
    initImageZoom();

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
            const card = createProjectCard(project);
            projectsGrid.appendChild(card);
        });

    } catch (err) {
        console.error("Failed to load projects:", err);
    }
}

/* =========================
   CREATE PROJECT CARD
========================= */

function createProjectCard(project) {

    const card = document.createElement("article");
    card.className = "project-card";

    const techBadges = (project.technologies || [])
        .map(t => `<span class="tech-badge">${t}</span>`)
        .join("");

    card.innerHTML = `
        <div class="project-image">
            <img src="${project.imageUrl}" alt="${project.name}" loading="lazy">
        </div>

        <div class="project-content">

            <h3 class="project-title">${project.name || "Untitled"}</h3>

            <p class="project-description">
                ${project.description || ""}
            </p>

            <div class="project-tech">
                ${techBadges}
            </div>

            <div class="project-links">

                <a class="project-btn demo-btn"
                   href="${project.projectUrl || "#"}"
                   target="_blank"
                   rel="noopener noreferrer">
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

    return card;
}

/* =========================
   OPEN MODAL
========================= */

function openProjectModal(project) {

    const modalEl = document.getElementById("projectModal");
    modalEl.classList.add("show");

    setText("modalTitle", project.name);
    setText("modalSubtitle", project.subtitle);
    setText("modalDescription", project.description);

    renderGallery(project);
    renderTech(project);
    renderFeatures(project);
}

/* =========================
   MODAL HELPERS
========================= */

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "";
}

/* =========================
   GALLERY
========================= */

function renderGallery(project) {

    const gallery = document.getElementById("modalGallery");
    if (!gallery) return;

    gallery.innerHTML = "";

    const images = project.images?.length
        ? project.images
        : [project.imageUrl];

    images.forEach(img => {

        const image = document.createElement("img");
        image.src = img;
        image.alt = project.name || "project image";
        image.loading = "lazy";
        image.style.cursor = "zoom-in";

        // ZOOM CLICK
        image.addEventListener("click", () => {
            openImageZoom(img);
        });

        gallery.appendChild(image);
    });
}

/* =========================
   TECH STACK
========================= */

function renderTech(project) {

    const tech = document.getElementById("modalTechStack");
    if (!tech) return;

    tech.innerHTML = "";

    (project.technologies || []).forEach(t => {
        const span = document.createElement("span");
        span.textContent = t;
        tech.appendChild(span);
    });
}

/* =========================
   FEATURES
========================= */

function renderFeatures(project) {

    const features = document.getElementById("modalFeatures");
    if (!features) return;

    features.innerHTML = "";

    (project.features || []).forEach(f => {
        const li = document.createElement("li");
        li.textContent = f;
        features.appendChild(li);
    });
}

/* =========================
   CLOSE MODAL
========================= */

function closeModal() {
    const modalEl = document.getElementById("projectModal");
    modalEl.classList.remove("show");
}

/* =========================
   IMAGE ZOOM SYSTEM
========================= */

function initImageZoom() {

    zoomOverlay = document.getElementById("imageZoom");
    zoomImage = document.getElementById("zoomImage");

    const closeBtn = document.getElementById("zoomCloseBtn");

    closeBtn?.addEventListener("click", closeImageZoom);

    zoomOverlay?.addEventListener("click", (e) => {
        if (e.target === zoomOverlay) {
            closeImageZoom();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
            closeImageZoom();
        }
    });
}

function openImageZoom(src) {
    if (!zoomOverlay || !zoomImage) return;

    zoomImage.src = src;
    zoomOverlay.classList.add("show");
}

function closeImageZoom() {
    if (!zoomOverlay || !zoomImage) return;

    zoomOverlay.classList.remove("show");
    zoomImage.src = "";
}

/* =========================
   EVENTS (MODAL CLOSE)
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const closeBtn = document.getElementById("closeModalBtn");
    const modalEl = document.getElementById("projectModal");

    closeBtn?.addEventListener("click", closeModal);

    modalEl?.addEventListener("click", (e) => {
        if (e.target === modalEl) closeModal();
    });

});