import { db } from "../firebase-config.js";
import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/**
 * Fetch all certificates from Firestore, ordered by the 'order' field.
 * @returns {Promise<Array>} Array of certificate objects.
 */
export async function fetchCertificates() {
    const q = query(collection(db, "certificates"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
}