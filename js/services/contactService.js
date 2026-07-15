import { db } from "../firebase-config.js";
import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/**
 * Fetch contact information from Firestore.
 * @returns {Promise<Object>} Contact data (email, location, linkedin, github).
 */
export async function fetchContactInfo() {
    const docRef = doc(db, "contactInfo", "main");
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        throw new Error("No contact data found in Firestore");
    }
    return docSnap.data();
}

/**
 * Send a message to Firestore.
 * @param {Object} messageData - { name, email, message }
 * @returns {Promise<void>}
 */
export async function sendMessageToFirestore(messageData) {
    await addDoc(collection(db, "messages"), {
        ...messageData,
        status: "unread",
        createdAt: serverTimestamp()
    });
}