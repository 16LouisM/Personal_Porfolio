import { db } from "../firebase-config.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
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

    const form = document.getElementById("contactForm");

    if (form && !form.dataset.initialized) {

        form.addEventListener("submit", sendMessage);

        form.dataset.initialized = "true";
    }
}
async function sendMessage(event) {

    event.preventDefault();

    const submitBtn =
        document.querySelector(".contact-form button");

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const message =
        document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
    }

    try {

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        await addDoc(collection(db, "messages"), {
            name,
            email,
            message,
            status: "unread",
            createdAt: serverTimestamp()
        });

        alert("Message sent successfully!");

        document.getElementById("contactForm").reset();

    } catch (error) {

        console.error(error);

        alert("Failed to send message.");

    } finally {

        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";

    }
}