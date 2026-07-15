import { db } from "../firebase-config.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =========================
   DOM ELEMENTS
========================= */

const toggleBtn = document.getElementById("toggleCertificatesBtn");

let allCertificates = [];
let showingAll = false;

const INITIAL_CERTIFICATES = 4;

const container = document.getElementById("certificatesContainer");

const modal = document.getElementById("certificateModal");
const modalImg = document.getElementById("modalCertificateImage");
const modalTitle = document.getElementById("modalCertificateTitle");
const modalDesc = document.getElementById("modalCertificateDescription");
const closeModal = document.getElementById("closeCertificateModal");

/* =========================
   RESPONSIVE CARD COUNT
========================= */

function getInitialCertificateCount() {

    const width = window.innerWidth;

    // 3-column desktop layout
    if (width >= 1200 && width < 1600) {
        return 3;
    }

    // All other layouts
    return INITIAL_CERTIFICATES;
}

/* =========================
   FETCH CERTIFICATES
========================= */

async function fetchCertificates() {

    try {

        const q = query(
            collection(db, "certificates"),
            orderBy("order", "asc")
        );

        const snapshot = await getDocs(q);

        allCertificates = snapshot.docs.map(doc => doc.data());

        renderCertificates();

    } catch (error) {

        console.error("Error fetching certificates:", error);

        container.innerHTML = "<p>Failed to load certificates.</p>";
    }

}

/* =========================
   RENDER CERTIFICATE CARD
========================= */

function renderCertificate(cert) {

    const card = document.createElement("div");

    card.classList.add("certificate-card");

    card.innerHTML = `
        <div class="certificate-image">
            <img src="${cert.imageURL}" alt="${cert.title}">
        </div>

        <div class="certificate-content">
            <h3>${cert.title}</h3>

            <p class="issuer">${cert.issuer}</p>

            ${cert.Date ? `<p class="date">${cert.Date}</p>` : ""}

            <p class="description">${cert.description}</p>
        </div>
    `;

    card.addEventListener("click", () => {
        openModal(cert);
    });

    container.appendChild(card);

}

/* =========================
   RENDER CERTIFICATES
========================= */

function renderCertificates() {

    container.innerHTML = "";

    const initialCount = getInitialCertificateCount();

    const certificatesToShow = showingAll
        ? allCertificates
        : allCertificates.slice(0, initialCount);

    certificatesToShow.forEach(renderCertificate);

    if (allCertificates.length > initialCount) {

        toggleBtn.hidden = false;

        toggleBtn.textContent = showingAll
            ? "Show Less"
            : "View All Certificates";

    } else {

        toggleBtn.hidden = true;

    }

}

/* =========================
   MODAL LOGIC
========================= */

function openModal(cert) {

    modalImg.src = cert.imageURL;
    modalTitle.textContent = cert.title;
    modalDesc.textContent = cert.description;

    const modalInfo = document.querySelector(".modal-info");

    modalInfo.innerHTML = `
        <h3>${cert.title}</h3>
        <p class="issuer">${cert.issuer}</p>
        ${cert.Date ? `<p class="date">Issued: ${cert.Date}</p>` : ""}
        <p class="description">${cert.description}</p>
    `;

    modal.classList.add("show");

}

closeModal.addEventListener("click", () => {
    modal.classList.remove("show");
});

window.addEventListener("click", (e) => {

    if (e.target === modal) {
        modal.classList.remove("show");
    }

});

/* =========================
   TOGGLE BUTTON
========================= */

toggleBtn.addEventListener("click", () => {

    showingAll = !showingAll;

    renderCertificates();

});

/* =========================
   RESPONSIVE RESIZE
========================= */

window.addEventListener("resize", () => {

    if (!showingAll) {
        renderCertificates();
    }

});

/* =========================
   INIT
========================= */

export async function initCertificates() {

    await fetchCertificates();

}