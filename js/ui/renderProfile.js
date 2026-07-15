/**
 * Renders profile data into the DOM.
 * @param {Object} profile - { fullName, about, profileImage }
 */
export function renderProfile(profile) {
    const nameEl = document.getElementById("profile-name");
    const descEl = document.getElementById("profile-description");
    const imgEl = document.getElementById("profile-image");

    if (nameEl) nameEl.textContent = profile.fullName || "Mashele Louis";
    if (descEl) descEl.textContent = profile.about || "";
    if (imgEl) imgEl.src = profile.profileImage || "";
}