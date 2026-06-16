export async function loadNavbar() {
    const response = await fetch("../components/navbar.html");
    const html = await response.text();

    document.getElementById("navbar-container").innerHTML = html;

    // ----- DOM refs -----
    const navbar = document.getElementById("navbar");
    const navLinks = document.getElementById("nav-links");
    const menuToggle = document.getElementById("menu-toggle");
    const overlay = document.getElementById("nav-overlay");
    const underline = document.getElementById("nav-underline");
    const progress = document.getElementById("scroll-progress");

    let lastScrollY = window.scrollY;
    let isSidebarOpen = false;

    // =========================
    // Sidebar toggle (safe, with overflow & pointer‑events)
    // =========================
    function toggleSidebar(forceState) {
        const shouldOpen = (forceState !== undefined) ? forceState : !isSidebarOpen;

        if (shouldOpen === isSidebarOpen) return; // already in that state

        isSidebarOpen = shouldOpen;

        navLinks.classList.toggle('active', shouldOpen);
        menuToggle.classList.toggle('active', shouldOpen);
        overlay.classList.toggle('active', shouldOpen);

        // Prevent body scroll when open, restore when closed
        document.body.style.overflow = shouldOpen ? 'hidden' : '';

        // If closing, also force a small delay to let any pending clicks finish
        if (!shouldOpen) {
            // Ensure overlay pointer-events are disabled (done via CSS, but safe)
            overlay.style.pointerEvents = 'none';
        } else {
            overlay.style.pointerEvents = 'auto';
        }
    }

    // =========================
    // Close sidebar safely (used by various events)
    // =========================
    function closeSidebar() {
        if (isSidebarOpen) toggleSidebar(false);
    }

    // ----- Toggle on hamburger click -----
    menuToggle?.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleSidebar();
    });

    // ----- Close on overlay click -----
    overlay?.addEventListener("click", closeSidebar);

    // ----- Close on Escape key -----
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeSidebar();
    });

    // ----- Close on outside click (if not on menu or nav) -----
    document.addEventListener("click", (e) => {
        if (isSidebarOpen &&
            !navLinks.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            closeSidebar();
        }
    });

    // =========================
    // Link handling – close sidebar and navigate
    // =========================
    const links = document.querySelectorAll(".nav-links a");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            // Close sidebar if on mobile/tablet
            if (window.innerWidth <= 1024 && isSidebarOpen) {
                closeSidebar();
            }

            // Let the default anchor navigation happen (or use smooth scroll)
            // No preventDefault – the browser will scroll to the target
        });
    });

    // =========================
    // Scroll: hide navbar + progress bar (throttled)
    // =========================
    let ticking = false;
    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.scrollY;

                // hide/show navbar
                if (currentScroll > lastScrollY && currentScroll > 80) {
                    navbar.classList.add("hidden");
                } else {
                    navbar.classList.remove("hidden");
                }
                lastScrollY = currentScroll;

                // progress bar
                const docHeight = document.body.scrollHeight - window.innerHeight;
                const progressWidth = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;
                progress.style.width = progressWidth + "%";

                ticking = false;
            });
            ticking = true;
        }
    });

    // =========================
    // Active link + animated underline (desktop only)
    // =========================
    function moveUnderline(element) {
        if (window.innerWidth <= 1024 || !underline) return;
        const rect = element.getBoundingClientRect();
        const parentRect = element.closest('.nav-center').getBoundingClientRect();
        underline.style.width = rect.width + "px";
        underline.style.left = (rect.left - parentRect.left) + "px";
    }

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

    // Set initial active and underline
    const activeLink = document.querySelector(".nav-links a.active") || links[0];
    if (activeLink) {
        activeLink.classList.add("active");
        moveUnderline(activeLink);
    }

    // Recalculate underline on resize (debounced)
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const active = document.querySelector(".nav-links a.active");
            if (active && window.innerWidth > 1024) {
                moveUnderline(active);
            }
            // If resizing to desktop, close sidebar if open
            if (window.innerWidth > 1024 && isSidebarOpen) {
                closeSidebar();
            }
            // If resizing to mobile, ensure overflow is not locked
            if (window.innerWidth <= 1024 && !isSidebarOpen) {
                document.body.style.overflow = '';
            }
        }, 150);
    });

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

    // =========================
    // Theme toggle (optional)
    // =========================
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    if (themeToggle) {
        let darkMode = localStorage.getItem('theme') === 'dark';

        function applyTheme(dark) {
            if (dark) {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.className = 'fa-solid fa-sun';
            } else {
                document.documentElement.removeAttribute('data-theme');
                themeIcon.className = 'fa-solid fa-moon';
            }
            localStorage.setItem('theme', dark ? 'dark' : 'light');
            darkMode = dark;
        }

        applyTheme(darkMode);

        themeToggle.addEventListener('click', () => {
            applyTheme(!darkMode);
        });
    }

    // =========================
    // Cleanup: when page unloads, reset overflow
    // =========================
    window.addEventListener('beforeunload', () => {
        document.body.style.overflow = '';
    });
}