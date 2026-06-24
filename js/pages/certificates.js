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

const container = document.getElementById("certificatesContainer");

const modal = document.getElementById("certificateModal");
const modalImg = document.getElementById("modalCertificateImage");
const modalTitle = document.getElementById("modalCertificateTitle");
const modalDesc = document.getElementById("modalCertificateDescription");
const closeModal = document.getElementById("closeCertificateModal");

/* =========================
   FETCH CERTIFICATES
========================= */

async function fetchCertificates() {
    try {
        const q = query(collection(db, "certificates"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);

        container.innerHTML = "";

        snapshot.forEach((doc) => {
            const cert = doc.data();
            renderCertificate(cert);
        });

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
            <p class="description">${cert.description}</p>
        </div>
    `;

    card.addEventListener("click", () => {
        openModal(cert);
    });

    container.appendChild(card);
}

/* =========================
   MODAL LOGIC
========================= */

function openModal(cert) {
    modalImg.src = cert.imageURL;
    modalTitle.textContent = cert.title;
    modalDesc.textContent = cert.description;

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
   INIT
========================= */

await fetchCertificates();