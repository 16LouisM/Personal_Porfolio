import { fetchCertificates } from "../services/certificateService.js";
import {
    initModal,
    showModal,
    renderCertificateGrid,
    renderModalContent,
} from "../ui/renderCertificates.js";

/* =========================
   STATE
========================= */

let allCertificates = [];
let showingAll = false;
const INITIAL_CERTIFICATES = 4;

/* =========================
   ENTRY POINT
========================= */

export async function initCertificates() {
    const container = document.getElementById("certificatesContainer");
    if (!container) return;

    // Initialize modal events
    initModal();

    try {
        allCertificates = await fetchCertificates();

        if (allCertificates.length === 0) {
            container.innerHTML = "<p>No certificates found.</p>";
            return;
        }

        // Initial render
        renderCurrentCertificates();

        // Toggle button
        const toggleBtn = document.getElementById("toggleCertificatesBtn");
        toggleBtn.addEventListener("click", () => {
            showingAll = !showingAll;
            renderCurrentCertificates();
        });

        // Resize handler: re-render if not showing all (to adjust card count)
        window.addEventListener("resize", () => {
            if (!showingAll) {
                renderCurrentCertificates();
            }
        });

    } catch (error) {
        console.error("Error loading certificates:", error);
        container.innerHTML = "<p>Failed to load certificates.</p>";
    }
}

/* =========================
   RENDER LOGIC
========================= */

function renderCurrentCertificates() {
    const initialCount = getInitialCertificateCount();
    const limit = showingAll ? -1 : initialCount;

    renderCertificateGrid(
        allCertificates,
        "certificatesContainer",
        limit,
        (cert) => {
            // Card click – open modal
            renderModalContent(cert);
            showModal();
        }
    );

    // Update toggle button visibility and text
    const toggleBtn = document.getElementById("toggleCertificatesBtn");
    if (allCertificates.length > getInitialCertificateCount()) {
        toggleBtn.hidden = false;
        toggleBtn.textContent = showingAll
            ? "Show Less"
            : "View All Certificates";
    } else {
        toggleBtn.hidden = true;
    }
}

function getInitialCertificateCount() {
    const width = window.innerWidth;
    // 3‑column layout on medium‑large screens
    if (width >= 1200 && width < 1600) {
        return 3;
    }
    return INITIAL_CERTIFICATES;
}