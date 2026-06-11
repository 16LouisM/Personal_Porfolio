export function initializeTyping() {

    const typingElement = document.getElementById("typing-text");

    if (!typingElement) return;

    const roles = [
        "Information Technology Graduate",
        "Web Developer",
        "Java Developer",
        "Networking Enthusiast",
        "Software Developer"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {

        const currentRole = roles[roleIndex];

        if (isDeleting === false) {

            typingElement.textContent =
                currentRole.substring(0, charIndex + 1);

            charIndex++;

            if (charIndex === currentRole.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }

        } else {

            typingElement.textContent =
                currentRole.substring(0, charIndex - 1);

            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }

        }

        setTimeout(type, isDeleting ? 50 : 100);
    }

    type();
}