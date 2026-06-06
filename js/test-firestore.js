import app from "./firebase-config.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const db = getFirestore(app);

async function testFirestore() {
  try {

    const snapshot = await getDocs(
      collection(db, "projects")
    );

    console.log("✅ Firebase Connected");
    console.log("✅ Firestore Connected");

    snapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
    });

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testFirestore();