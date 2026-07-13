import { db } from "../firebase-config.js";
import {
    doc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

function setCounter(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.dataset.count = value || 0;
    }

}

function createTimelineItem(title, subtitle, description) {

    return `
        <div class="timeline-item">
            <h3>${title || ""}</h3>
            <span>${subtitle || ""}</span>
            <p>${description || ""}</p>
        </div>
    `;

}

async function loadAboutText() {

    const aboutSnap = await getDoc(
        doc(db, "about", "main")
    );

    if (!aboutSnap.exists()) return;

    const data = aboutSnap.data();

    const aboutText =
        document.getElementById("about-text");

    const journeyImage =
        document.getElementById("journey-image");

    if (aboutText) {
        // Use replaceAll for clearer intent and to satisfy linting rule
        aboutText.innerHTML = (data.text || "").replaceAll("\n", "<br>");
    }

    if (journeyImage) {
        journeyImage.src =
            data.imageUrl || "";
    }

}

async function loadStats() {

    const statsSnap = await getDoc(
        doc(db, "stats", "main")
    );

    if (!statsSnap.exists()) return;

    const stats = statsSnap.data();

    setCounter(
        "projects-count",
        stats.projects
    );

    setCounter(
        "skills-count",
        stats.skills
    );

    setCounter(
        "certificates-count",
        stats.certificates
    );

    setCounter(
        "experience-years",
        stats.experienceYears
    );

}

async function loadExperience() {

    const container =
        document.getElementById("experience-list");

    if (!container) return;

    container.innerHTML = "";

    const snapshot = await getDocs(
        collection(db, "experience")
    );

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        container.innerHTML += createTimelineItem(
            data.title,
            data.period,
            data.description
        );

    });

}

async function loadEducation() {

    const container =
        document.getElementById("education-list");

    if (!container) return;

    container.innerHTML = "";

    const snapshot = await getDocs(
        collection(db, "education")
    );

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        container.innerHTML += createTimelineItem(
            data.institution,
            data.qualification,
            data.description
        );

    });

}

export async function initAboutPage() {

    if (!document.getElementById("about")) {
        return;
    }

    try {

        await loadAboutText();
        await loadStats();
        await loadExperience();
        await loadEducation();

    } catch (error) {

        console.error(
            "Error loading About section:",
            error
        );

    }

}