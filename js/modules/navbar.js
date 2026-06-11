export async function loadNavbar() {

    const response = await fetch("../components/navbar.html");
    const html = await response.text();

    document.getElementById("navbar-container").innerHTML = html;

    const navbar = document.getElementById("navbar");
    const navLinks = document.getElementById("nav-links");
    const menuToggle = document.getElementById("menu-toggle");
    const underline = document.getElementById("nav-underline");
    const progress = document.getElementById("scroll-progress");

    let lastScrollY = window.scrollY;

    // =========================
    // Mobile menu toggle
    // =========================
    menuToggle?.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // =========================
    // Click outside to close
    // =========================
    document.addEventListener("click", (e) => {
        if (
            !navLinks.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {
            navLinks.classList.remove("active");
        }
    });

    // =========================
    // ESC key close
    // =========================
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            navLinks.classList.remove("active");
        }
    });

    // =========================
    // Scroll hide/show navbar
    // =========================
    window.addEventListener("scroll", () => {

        // hide/show navbar
        if (window.scrollY > lastScrollY) {
            navbar.classList.add("hidden"); // scrolling down
        } else {
            navbar.classList.remove("hidden"); // scrolling up
        }

        lastScrollY = window.scrollY;

        // scroll progress bar
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progressWidth = (scrollTop / docHeight) * 100;

        progress.style.width = progressWidth + "%";
    });

    // =========================
    // Active link + animated underline
    // =========================
    const links = document.querySelectorAll(".nav-links a");

    links.forEach(link => {

        link.addEventListener("mouseenter", (e) => {
            moveUnderline(e.target);
        });

        link.addEventListener("click", (e) => {
            links.forEach(l => l.classList.remove("active"));
            e.target.classList.add("active");
            moveUnderline(e.target);
        });
    });

    function moveUnderline(element) {

        if (window.innerWidth <= 768) return;
        
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement.parentElement.getBoundingClientRect();

        underline.style.width = rect.width + "px";
        underline.style.left = (rect.left - parentRect.left) + "px";
    }

    // default underline position
    const active = document.querySelector(".nav-links a.active");
    if (active) moveUnderline(active);

    // =========================
    // Scroll spy (section tracking)
    // =========================
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            const id = entry.target.getAttribute("id");
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);

            if (entry.isIntersecting) {

                links.forEach(l => l.classList.remove("active"));
                link?.classList.add("active");

                if (link) moveUnderline(link);
            }
        });

    }, { threshold: 0.6 });

    sections.forEach(section => observer.observe(section));
}