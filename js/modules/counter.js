export function initializeCounters() {

    const statElements = document.querySelectorAll("[data-count]");

    if (!statElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const element = entry.target;
            const target = Number(element.dataset.count);

            let current = 0;

            const duration = 2000;
            const increment = Math.max(1, Math.ceil(target / 100));

            const timer = setInterval(() => {

                current += increment;

                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }

                element.textContent = `${current}+`;

            }, duration / target);

            obs.unobserve(element);

        });

    }, {
        threshold: 0.5
    });

    statElements.forEach(element => observer.observe(element));
}