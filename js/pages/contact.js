import { db } from "../firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =========================
   INIT CONTACT SECTION
========================= */

export async function initContact() {
    const docRef = doc(db, "contactInfo", "main");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.error("No contact data found in Firestore");
        return;
    }

    const data = docSnap.data();

    // Fill contact info
    document.getElementById("contact-email").textContent = data.email;
    document.getElementById("contact-phone").textContent = data.phone;
    document.getElementById("contact-location").textContent = data.location;

    // Social links
    const socialContainer = document.getElementById("social-links");
    socialContainer.innerHTML = "";

    for (const key in data.socials) {
        const a = document.createElement("a");
        a.href = data.socials[key];
        a.target = "_blank";
        a.innerHTML = `<i class="fab fa-${key}"></i>`;
        socialContainer.appendChild(a);
    }
}