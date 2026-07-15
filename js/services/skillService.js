import { db } from "../firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function getSkills() {
    try {
        const snapshot = await getDocs(collection(db, "skills"));

        const skills = [];

        snapshot.forEach(doc => {
            skills.push(doc.data());
        });

        return skills;

    } catch (error) {
        console.error("SkillService error:", error);
        return [];
    }
}