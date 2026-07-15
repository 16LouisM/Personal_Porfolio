/* =========================
   DOM REFERENCES & SCROLL LOCK
========================= */

let modal = null;
let zoomOverlay = null;
let zoomImage = null;
let galleryLockTimeout = null;
let galleryLocked = false;

// Scroll lock counter – prevents premature unlocking
let scrollLockCount = 0;

function lockScroll() {
    if (scrollLockCount === 0) {
        document.body.style.overflow = 'hidden';
    }
    scrollLockCount++;
}

function unlockScroll() {
    scrollLockCount--;
    if (scrollLockCount <= 0) {
        scrollLockCount = 0;
        document.body.style.overflow = '';
    }
}

/* =========================
   INIT: Modal & Zoom
========================= */

export function initModal() {
    modal = document.getElementById("projectModal");
    const closeBtn = document.getElementById("closeModalBtn");
    if (closeBtn) {
        closeBtn.addEventListener("click", hideModal);
    }
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) hideModal();
        });
    }
}

export function initZoom() {
    zoomOverlay = document.getElementById("imageZoom");
    zoomImage = document.getElementById("zoomImage");
    const closeBtn = document.getElementById("zoomCloseBtn");
    if (closeBtn) {
        closeBtn.addEventListener("click", closeZoom);
    }
    if (zoomOverlay) {
        zoomOverlay.addEventListener("click", (e) => {
            if (e.target === zoomOverlay) closeZoom();
        });
    }
}

/* =========================
   MODAL VISIBILITY (with scroll lock)
========================= */

export function showModal() {
    if (modal) {
        modal.classList.add("show");
        lockScroll();  // lock page scroll
    }
}

export function hideModal() {
    if (modal) {
        modal.classList.remove("show");
        unlockScroll();  // release scroll lock (if no other overlay is open)
    }
    // Optionally close zoom if it's still open – but zoom will close independently
}

/* =========================
   ZOOM VISIBILITY (with scroll lock)
========================= */

export function openZoom(src) {
    if (!zoomOverlay || !zoomImage) return;
    zoomImage.src = src;
    zoomOverlay.classList.add("show");
    lockScroll();  // additional lock (safe because counter tracks it)
}

export function closeZoom() {
    if (!zoomOverlay || !zoomImage) return;
    zoomOverlay.classList.remove("show");
    zoomImage.src = "";
    unlockScroll();
}

/* =========================
   RENDER PROJECT CARDS
========================= */

export function renderProjectGrid(projects, containerId, limit, callbacks) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    const visibleProjects = limit === -1
        ? projects
        : projects.slice(0, limit);

    visibleProjects.forEach((project) => {
        const originalIndex = projects.indexOf(project);
        const card = createProjectCard(project, originalIndex, callbacks);
        container.appendChild(card);
    });
}

function createProjectCard(project, index, callbacks) {
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
            <p class="project-description">${project.description || ""}</p>
            <div class="project-tech">${techBadges}</div>
            <div class="project-links">
                <a class="project-btn demo-btn"
                   href="${project.projectUrl || "#"}"
                   target="_blank"
                   rel="noopener noreferrer">View</a>
                <button class="project-btn details-btn">Details</button>
            </div>
        </div>
    `;

    card.querySelector(".details-btn").addEventListener("click", () => {
        if (callbacks && typeof callbacks.onDetailsClick === "function") {
            callbacks.onDetailsClick(index);
        }
    });

    return card;
}

/* =========================
   RENDER MODAL CONTENT
========================= */

export function renderModalContent(project, callbacks) {
    if (!modal) return;

    setText("modalTitle", project.name);
    setText("modalSubtitle", project.subtitle);
    setText("modalDescription", project.description);

    renderGallery(project, callbacks);
    renderTech(project);
    renderFeatures(project);
}

/* ---------- helpers ---------- */

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "";
}

/* ---------- Gallery ---------- */

function renderGallery(project, callbacks) {
    const gallery = document.getElementById("modalGallery");
    if (!gallery) return;

    gallery.innerHTML = "";

    const images = project.images?.length
        ? project.images
        : [project.imageUrl];

    let startX = 0;
    let moved = false;
    let pointerStartTime = 0;

    galleryLocked = false;
    clearTimeout(galleryLockTimeout);

    function lockGallery() {
        galleryLocked = true;
        clearTimeout(galleryLockTimeout);
        galleryLockTimeout = setTimeout(() => {
            galleryLocked = false;
        }, 250);
    }

    images.forEach((imgSrc, idx) => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = project.name || "project image";
        img.loading = "lazy";
        img.style.cursor = "zoom-in";

        img.addEventListener("pointerdown", (e) => {
            moved = false;
            pointerStartTime = Date.now();
            startX = e.clientX;
        });

        img.addEventListener("pointermove", (e) => {
            const dx = Math.abs(e.clientX - startX);
            if (dx > 8) moved = true;
        });

        img.addEventListener("click", (e) => {
            const duration = Date.now() - pointerStartTime;
            if (moved || galleryLocked || duration > 250) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            if (callbacks && typeof callbacks.onImageClick === "function") {
                callbacks.onImageClick(idx);
            }
        });

        gallery.appendChild(img);
    });

    gallery.addEventListener("scroll", lockGallery, { passive: true });
    gallery.addEventListener("wheel", lockGallery, { passive: true });

    gallery.addEventListener("pointerdown", (e) => {
        startX = e.clientX;
    });

    gallery.addEventListener("pointerup", (e) => {
        if (galleryLocked) return;
        const diff = startX - e.clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                if (callbacks && typeof callbacks.onSwipeNext === "function") {
                    callbacks.onSwipeNext();
                }
            } else if (callbacks && typeof callbacks.onSwipePrev === "function") {
                    callbacks.onSwipePrev();
                }
        }
    });
}

/* ---------- Tech Stack ---------- */

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

/* ---------- Features ---------- */

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