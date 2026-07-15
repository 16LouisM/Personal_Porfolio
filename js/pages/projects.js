import { fetchProjects } from "../services/projectService.js";
import {
    initModal,
    initZoom,
    showModal,
    hideModal,
    openZoom,
    closeZoom,
    renderProjectGrid,
    renderModalContent,
} from "../ui/renderProjects.js";

/* =========================
   STATE
========================= */

let currentProjects = [];
let showingAllProjects = false;
let currentProjectIndex = 0;
let currentImageIndex = 0;

/* =========================
   ENTRY POINT
========================= */

export async function initProjects() {
    const projectsGrid = document.getElementById("projects-grid");
    if (!projectsGrid) return;

    // Initialize UI components
    initModal();
    initZoom();

    try {
        currentProjects = await fetchProjects();

        if (currentProjects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="projects-empty">
                    <h3>No Projects Found</h3>
                </div>
            `;
            return;
        }

        // Initial render (showing limited projects)
        renderCurrentProjects();

        // Toggle button
        const toggleBtn = document.getElementById("toggleProjectsBtn");
        toggleBtn.onclick = () => {
            showingAllProjects = !showingAllProjects;
            renderCurrentProjects();
            if (!showingAllProjects) {
                document.getElementById("projects").scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        };

        // Keyboard controls
        document.addEventListener("keydown", handleKeydown);

    } catch (err) {
        console.error("Failed to load projects:", err);
    }
}

/* =========================
   RENDER LOGIC
========================= */

function renderCurrentProjects() {
    const initialCount = getInitialProjectCount();
    const limit = showingAllProjects ? -1 : initialCount;

    renderProjectGrid(
        currentProjects,
        "projects-grid",
        limit,
        {
            onDetailsClick: openProjectModal,
        }
    );

    // Update toggle button visibility and text
    const toggleBtn = document.getElementById("toggleProjectsBtn");
    if (currentProjects.length > getInitialProjectCount()) {
        toggleBtn.hidden = false;
        toggleBtn.textContent = showingAllProjects
            ? "Show Less"
            : "View All Projects";
    } else {
        toggleBtn.hidden = true;
    }
}

function getInitialProjectCount() {
    const width = window.innerWidth;
    if (width >= 1200 && width < 1600) return 3;
    return 4;
}

/* =========================
   MODAL NAVIGATION
========================= */

function openProjectModal(index) {
    const project = currentProjects[index];
    if (!project) {
        console.error("Invalid project index:", index);
        return;
    }

    currentProjectIndex = index;
    currentImageIndex = 0;

    // Populate modal content with callbacks
    renderModalContent(project, {
        onImageClick: (imgIndex) => {
            currentImageIndex = imgIndex;
            const images = getCurrentProjectImages();
            openZoom(images[currentImageIndex]);
        },
        onSwipeNext: () => {
            const images = getCurrentProjectImages();
            currentImageIndex = (currentImageIndex + 1) % images.length;
            openZoom(images[currentImageIndex]);
        },
        onSwipePrev: () => {
            const images = getCurrentProjectImages();
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            openZoom(images[currentImageIndex]);
        },
    });

    showModal();
}

function getCurrentProjectImages() {
    const project = currentProjects[currentProjectIndex];
    return project?.images?.length ? project.images : [project.imageUrl];
}

function nextProject() {
    if (!currentProjects.length) return;
    currentProjectIndex = (currentProjectIndex + 1) % currentProjects.length;
    openProjectModal(currentProjectIndex);
}

function prevProject() {
    if (!currentProjects.length) return;
    currentProjectIndex = (currentProjectIndex - 1 + currentProjects.length) % currentProjects.length;
    openProjectModal(currentProjectIndex);
}

function nextImage() {
    const images = getCurrentProjectImages();
    currentImageIndex = (currentImageIndex + 1) % images.length;
    openZoom(images[currentImageIndex]);
}

function prevImage() {
    const images = getCurrentProjectImages();
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    openZoom(images[currentImageIndex]);
}

/* =========================
   KEYBOARD HANDLER
========================= */

function handleKeydown(e) {
    switch (e.key) {
        case "Escape":
            hideModal();
            closeZoom();
            break;
        case "ArrowRight":
            nextProject();
            break;
        case "ArrowLeft":
            prevProject();
            break;
        case "ArrowUp":
            nextImage();
            break;
        case "ArrowDown":
            prevImage();
            break;
    }
}

/* =========================
   RESIZE HANDLER (optional)
========================= */

window.addEventListener("resize", () => {
    if (!showingAllProjects) {
        renderCurrentProjects();
    }
});