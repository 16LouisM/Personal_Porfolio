/**
 * Populate the contact section with data.
 * @param {Object} data - Contact data from Firestore.
 */
export function renderContactInfo(data) {
    const emailEl = document.getElementById("contact-email");
    const locationEl = document.getElementById("contact-location");
    const emailCard = document.getElementById("email-card");
    const linkedinCard = document.getElementById("linkedin-card");
    const githubCard = document.getElementById("github-card");

    if (emailEl) emailEl.textContent = data.email || "Not Available";
    if (locationEl) locationEl.textContent = data.location || "Not Available";
    if (emailCard) emailCard.href = `mailto:${data.email || ""}`;
    if (linkedinCard) linkedinCard.href = data.linkedin || "#";
    if (githubCard) githubCard.href = data.github || "#";
}

/**
 * Show a temporary feedback message.
 * @param {string} message - The message to display.
 * @param {string} type - 'success' or 'error'.
 */
export function showFeedback(message, type = "success") {
    // You can implement a toast or inline feedback here.
    // For simplicity, we keep the original alert, but you may replace it.
    // This function is for future extensibility.
    alert(message);
}