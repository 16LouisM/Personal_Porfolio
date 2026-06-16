import { app } from "../firebase-config.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const db = getFirestore(app);

export async function loadProfile() {

  try {

    const profileRef = doc(db, "siteInfo", "profile");
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      console.error("Profile document not found");
      return;
    }

    const profile = profileSnap.data();

    document.getElementById("profile-name").textContent =
      profile.fullName || "Mashele Louis";

    document.getElementById("profile-description").textContent =
      profile.about || "";

    document.getElementById("profile-image").src =
      profile.profileImage || "";

  } catch (error) {
    console.error("Error loading profile:", error);
  }
}