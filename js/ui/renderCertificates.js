/* =========================
   DOM REFERENCES & SCROLL LOCK
========================= */

let modal = null;
let modalImg = null;
let modalTitle = null;
let modalDesc = null;
let modalInfo = null;

// Scroll lock counter
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
   INIT: Modal & Events
========================= */

export function initModal() {
    modal = document.getElementById("certificateModal");
    modalImg = document.getElementById("modalCertificateImage");
    modalTitle = document.getElementById("modalCertificateTitle");
    modalDesc = document.getElementById("modalCertificateDescription");
    modalInfo = document.querySelector(".modal-info");

    const closeBtn = document.getElementById("closeCertificateModal");
    if (closeBtn) {
        closeBtn.addEventListener("click", hideModal);
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) hideModal();
        });
    }

    // Keyboard: Escape closes modal
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            hideModal();
        }
    });
}

/* =========================
   MODAL VISIBILITY (with scroll lock)
========================= */

export function showModal() {
    if (modal) {
        modal.classList.add("show");
        lockScroll();
    }
}

export function hideModal() {
    if (modal) {
        modal.classList.remove("show");
        unlockScroll();
    }
}

/* =========================
   RENDER CERTIFICATE GRID
========================= */

/**
 * Renders certificate cards into the specified container.
 * @param {Array} certificates - Full array of certificate objects.
 * @param {string} containerId - ID of the grid container.
 * @param {number} limit - Number of cards to show; use -1 for all.
 * @param {Function} onCardClick - Callback when a card is clicked (receives certificate object).
 */
export function renderCertificateGrid(certificates, containerId, limit, onCardClick) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    const visible = limit === -1
        ? certificates
        : certificates.slice(0, limit);

    visible.forEach((cert) => {
        const card = createCard(cert, onCardClick);
        container.appendChild(card);
    });
}

/**
 * Creates a single certificate card DOM element.
 */
function createCard(cert, onCardClick) {
    const card = document.createElement("div");
    card.className = "certificate-card";

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
        if (typeof onCardClick === "function") {
            onCardClick(cert);
        }
    });

    return card;
}

/* =========================
   RENDER MODAL CONTENT
========================= */

export function renderModalContent(cert) {
    if (!modal) return;

    if (modalImg) modalImg.src = cert.imageURL;
    if (modalTitle) modalTitle.textContent = cert.title;
    if (modalDesc) modalDesc.textContent = cert.description;

    if (modalInfo) {
        modalInfo.innerHTML = `
            <h3>${cert.title}</h3>
            <p class="issuer">${cert.issuer}</p>
            ${cert.Date ? `<p class="date">Issued: ${cert.Date}</p>` : ""}
            <p class="description">${cert.description}</p>
        `;
    }
}