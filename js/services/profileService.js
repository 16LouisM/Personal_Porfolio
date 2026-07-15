import { db } from "../firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/**
 * Fetch profile data from Firestore.
 * @returns {Promise<{fullName: string, about: string, profileImage: string}>}
 */
export async function fetchProfile() {
    const profileRef = doc(db, "siteInfo", "profile");
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
        console.warn("Profile document not found – using defaults.");
        return {
            fullName: "Mashele Louis",
            about: "",
            profileImage: "",
        };
    }

    const data = profileSnap.data();
    return {
        fullName: data.fullName || "Mashele Louis",
        about: data.about || "",
        profileImage: data.profileImage || "",
    };
}