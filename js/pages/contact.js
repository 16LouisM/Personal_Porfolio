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

    document.getElementById("contact-email").textContent =
        data.email || "Not Available";

    document.getElementById("contact-location").textContent =
        data.location || "Not Available";

    document.getElementById("email-card").href =
        `mailto:${data.email}`;

    document.getElementById("linkedin-card").href =
        data.linkedin || "#";

    document.getElementById("github-card").href =
        data.github || "#";
}