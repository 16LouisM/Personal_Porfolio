import { fetchContactInfo, sendMessageToFirestore } from "../services/contactService.js";
import { renderContactInfo, showFeedback } from "../ui/renderContact.js";

/* =========================
   INIT CONTACT SECTION
========================= */

let isInitialized = false;

export async function initContact() {
    // Prevent double initialization
    if (isInitialized) return;
    isInitialized = true;

    try {
        const data = await fetchContactInfo();
        renderContactInfo(data);

        // Bind form submission once
        const form = document.getElementById("contactForm");
        if (form && !form.dataset.initialized) {
            form.addEventListener("submit", handleFormSubmit);
            form.dataset.initialized = "true";
        }
    } catch (error) {
        console.error("Failed to load contact info:", error);
        // Optionally show a fallback message in the UI
    }
}

/* =========================
   FORM HANDLER
========================= */

async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector(".contact-form button");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    const name = nameInput?.value.trim() || "";
    const email = emailInput?.value.trim() || "";
    const message = messageInput?.value.trim() || "";

    if (!name || !email || !message) {
        showFeedback("Please fill in all fields.", "error");
        return;
    }

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
        }

        await sendMessageToFirestore({ name, email, message });

        showFeedback("Message sent successfully!", "success");
        form.reset();

    } catch (error) {
        console.error(error);
        showFeedback("Failed to send message. Please try again.", "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
        }
    }
}