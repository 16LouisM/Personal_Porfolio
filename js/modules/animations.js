export function initializeAnimations() {

    const animatedElements = document.querySelectorAll(
        ".fade-in, .slide-up"
    );

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }

        });

    }, {
        threshold: 0.2
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

}