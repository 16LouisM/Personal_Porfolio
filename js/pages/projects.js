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

let isScrolling = false;
let scrollTimeout;

let currentProjects = [];
let currentProjectIndex = 0;
let currentImageIndex = 0;

/* =========================
   INIT PROJECTS
========================= */

export async function initProjects() {

    const projectsGrid = document.getElementById("projects-grid");
    if (!projectsGrid) return;

    modal = document.getElementById("projectModal");

    initImageZoom();
    initKeyboardControls();

    try {

        const snapshot = await getDocs(
            query(collection(db, "projects"), orderBy("order", "asc"))
        );

        projectsGrid.innerHTML = "";
        currentProjects = [];

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

            currentProjects.push(project);

            const index = currentProjects.length - 1;

            const card = createProjectCard(project, index);
            projectsGrid.appendChild(card);
        });

    } catch (err) {
        console.error("Failed to load projects:", err);
    }
}

/* =========================
   CREATE PROJECT CARD
========================= */

function createProjectCard(project, index) {

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
        .addEventListener("click", () => {
            openProjectModal(index);
        });

    return card;
}

/* =========================
   OPEN MODAL (SAFE VERSION)
========================= */

function openProjectModal(index) {

    const project = currentProjects?.[index];

    if (!project) {
        console.error("Invalid project index:", index);
        return;
    }

    currentProjectIndex = index;

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
   NAVIGATION (PROJECTS)
========================= */

function nextProject() {

    if (!currentProjects.length) return;

    currentProjectIndex =
        (currentProjectIndex + 1) % currentProjects.length;

    openProjectModal(currentProjectIndex);
}

function prevProject() {

    if (!currentProjects.length) return;

    currentProjectIndex =
        (currentProjectIndex - 1 + currentProjects.length) %
        currentProjects.length;

    openProjectModal(currentProjectIndex);
}

/* =========================
   MODAL HELPERS
========================= */

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "";
}

/* =========================
   GALLERY (SWIPE + ZOOM)
========================= */

function renderGallery(project) {

    const gallery = document.getElementById("modalGallery");
    if (!gallery) return;

    gallery.innerHTML = "";

    const images = project.images?.length
        ? project.images
        : [project.imageUrl];

    currentImageIndex = 0;

    let startX = 0;
    let startY = 0;

    let moved = false;

    let interactionLock = false;
    let lockTimeout;

    let pointerStartTime = 0;

    // IMPORTANT: reset lock when rendering new gallery
    interactionLock = false;

    function lockInteraction() {
        interactionLock = true;
        clearTimeout(lockTimeout);

        lockTimeout = setTimeout(() => {
            interactionLock = false;
        }, 250);
    }

    images.forEach(img => {

        const image = document.createElement("img");
        image.src = img;
        image.alt = project.name || "project image";
        image.loading = "lazy";
        image.style.cursor = "zoom-in";

        /* =========================
           POINTER DOWN
        ========================= */
        image.addEventListener("pointerdown", (e) => {
            moved = false;

            pointerStartTime = Date.now();

            startX = e.clientX;
            startY = e.clientY;
        });

        /* =========================
           POINTER MOVE
        ========================= */
        image.addEventListener("pointermove", (e) => {

            const dx = Math.abs(e.clientX - startX);
            const dy = Math.abs(e.clientY - startY);

            if (dx > 8 || dy > 8) {
                moved = true;
            }
        });

        /* =========================
           CLICK (SAFE ZOOM)
        ========================= */
        image.addEventListener("click", (e) => {

            const clickDuration = Date.now() - pointerStartTime;

            // 🚫 HARD BLOCK ALL ACCIDENTAL TRIGGERS
            if (moved || interactionLock || clickDuration > 250) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            openImageZoom(img);
        });

        gallery.appendChild(image);
    });

    /* =========================
       SCROLL DETECTION (CRITICAL FIX)
    ========================= */
    gallery.addEventListener("scroll", lockInteraction, { passive: true });

    /* =========================
       WHEEL DETECTION (DESKTOP FIX)
    ========================= */
    gallery.addEventListener("wheel", lockInteraction, { passive: true });

    /* =========================
       POINTER DOWN ON GALLERY (SWIPE)
    ========================= */
    gallery.addEventListener("pointerdown", (e) => {
        startX = e.clientX;
    });

    gallery.addEventListener("pointerup", (e) => {

        if (interactionLock) return;

        const endX = e.clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) nextImage(images);
            else prevImage(images);
        }
    });
}

/* =========================
   IMAGE NAVIGATION
========================= */

function nextImage(images) {

    currentImageIndex =
        (currentImageIndex + 1) % images.length;

    openImageZoom(images[currentImageIndex]);
}

function prevImage(images) {

    currentImageIndex =
        (currentImageIndex - 1 + images.length) % images.length;

    openImageZoom(images[currentImageIndex]);
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
}

/* OPEN ZOOM */
function openImageZoom(src) {
    if (!zoomOverlay || !zoomImage) return;

    zoomImage.src = src;
    zoomOverlay.classList.add("show");
}

/* CLOSE ZOOM */
function closeImageZoom() {
    if (!zoomOverlay || !zoomImage) return;

    zoomOverlay.classList.remove("show");
    zoomImage.src = "";
}

/* =========================
   KEYBOARD CONTROLS
========================= */

function initKeyboardControls() {

    document.addEventListener("keydown", (e) => {

        const project = currentProjects[currentProjectIndex];
        if (!project) return;

        const images = project.images?.length
            ? project.images
            : [project.imageUrl];

        switch (e.key) {

            case "Escape":
                closeModal();
                closeImageZoom();
                break;

            case "ArrowRight":
                nextProject();
                break;

            case "ArrowLeft":
                prevProject();
                break;

            case "ArrowUp":
                nextImage(images);
                break;

            case "ArrowDown":
                prevImage(images);
                break;
        }
    });
}

/* =========================
   EVENTS
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const closeBtn = document.getElementById("closeModalBtn");
    const modalEl = document.getElementById("projectModal");

    closeBtn?.addEventListener("click", closeModal);

    modalEl?.addEventListener("click", (e) => {
        if (e.target === modalEl) closeModal();
    });
});