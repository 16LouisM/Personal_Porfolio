import { db } from "../firebase-config.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function initAboutPage() {

  // prevent crash if section doesn't exist
  if (!document.getElementById("about")) return;

  const aboutSnap = await getDoc(doc(db, "about", "main"));
  if (aboutSnap.exists()) {
    document.getElementById("about-text").textContent = aboutSnap.data().text;
  }

  const statsSnap = await getDoc(doc(db, "stats", "main"));
  if (statsSnap.exists()) {
    const data = statsSnap.data();

    document.getElementById("projects-count").textContent = data.projects + "+";
    document.getElementById("skills-count").textContent = data.skills + "+";
    document.getElementById("certificates-count").textContent = data.certificates + "+";
    document.getElementById("experience-years").textContent = data.experienceYears + "+";
  }

  const expContainer = document.getElementById("experience-list");
  const expSnap = await getDocs(collection(db, "experience"));

  expSnap.forEach(doc => {
    const d = doc.data();

    expContainer.innerHTML += `
      <div class="timeline-item">
        <h3>${d.title}</h3>
        <span>${d.period}</span>
        <p>${d.description}</p>
      </div>
    `;
  });

  const eduContainer = document.getElementById("education-list");
  const eduSnap = await getDocs(collection(db, "education"));

  eduSnap.forEach(doc => {
    const d = doc.data();

    eduContainer.innerHTML += `
      <div class="timeline-item">
        <h3>${d.institution}</h3>
        <span>${d.qualification}</span>
        <p>${d.description}</p>
      </div>
    `;
  });
}