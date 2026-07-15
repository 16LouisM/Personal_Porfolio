import { db } from "../firebase-config.js";
import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/**
 * Fetch all projects from Firestore, ordered by the 'order' field.
 * @returns {Promise<Array>} Array of project objects.
 */
export async function fetchProjects() {
    const snapshot = await getDocs(
        query(collection(db, "projects"), orderBy("order", "asc"))
    );
    const projects = [];
    snapshot.forEach((doc) => {
        projects.push(doc.data());
    });
    return projects;
}