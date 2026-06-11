export async function loadNavbar() {

    const response = await fetch("../components/navbar.html");
    const html = await response.text();

    document.getElementById("navbar-container").innerHTML = html;

    // Elements
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const navbar = document.querySelector(".navbar");

    // =========================
    // Mobile menu toggle
    // =========================
    menuToggle?.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // Close menu on link click
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });

    // Close menu on ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            navLinks?.classList.remove("active");
        }
    });

    // =========================
    // Scroll effect
    // =========================
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar?.classList.add("scrolled");
        } else {
            navbar?.classList.remove("scrolled");
        }
    });

    // =========================
    // Active section highlight (scroll spy)
    // =========================
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            const id = entry.target.getAttribute("id");
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);

            if (entry.isIntersecting) {

                document.querySelectorAll(".nav-links a")
                    .forEach(a => a.classList.remove("active"));

                link?.classList.add("active");
            }
        });

    }, { threshold: 0.6 });

    sections.forEach(section => observer.observe(section));
}