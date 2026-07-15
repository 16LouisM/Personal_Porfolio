import { db } from "../firebase-config.js";
import {
    doc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/**
 * Fetch about text and image URL.
 * @returns {Promise<{text: string, imageUrl: string}>}
 */
export async function fetchAboutText() {
    const aboutSnap = await getDoc(doc(db, "about", "main"));
    if (!aboutSnap.exists()) {
        return { text: "", imageUrl: "" };
    }
    const data = aboutSnap.data();
    return {
        text: data.text || "",
        imageUrl: data.imageUrl || ""
    };
}

/**
 * Fetch stats.
 * @returns {Promise<{projects: number, skills: number, certificates: number, experienceYears: number}>}
 */
export async function fetchStats() {
    const statsSnap = await getDoc(doc(db, "stats", "main"));
    if (!statsSnap.exists()) {
        return { projects: 0, skills: 0, certificates: 0, experienceYears: 0 };
    }
    return statsSnap.data();
}

/**
 * Fetch experience items (ordered by order or date if needed, but we'll just return array).
 * @returns {Promise<Array>} Array of experience objects.
 */
export async function fetchExperience() {
    const snapshot = await getDocs(collection(db, "experience"));
    const items = [];
    snapshot.forEach(docSnap => {
        items.push(docSnap.data());
    });
    return items;
}

/**
 * Fetch education items.
 * @returns {Promise<Array>} Array of education objects.
 */
export async function fetchEducation() {
    const snapshot = await getDocs(collection(db, "education"));
    const items = [];
    snapshot.forEach(docSnap => {
        items.push(docSnap.data());
    });
    return items;
}