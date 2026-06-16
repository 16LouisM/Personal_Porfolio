import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCPwUvhkjOfpIsPJGZeDq6jDRQMWE8QeM4",
  authDomain: "louis-portfolio-74463.firebaseapp.com",
  projectId: "louis-portfolio-74463",
  storageBucket: "louis-portfolio-74463.appspot.com",
  messagingSenderId: "888104599198",
  appId: "1:888104599198:web:dc437c6695d2761a10858f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };