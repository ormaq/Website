window.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const numSections = sections.length;
    let currentSection = 0;

    window.addEventListener('wheel', (event) => {
        event.preventDefault();

        const direction = event.deltaY > 0 ? 1 : -1;

        if (direction === 1 && currentSection < numSections - 1) {
            currentSection++;
        } else if (direction === -1 && currentSection > 0) {
            currentSection--;
        }

        sections[currentSection].scrollIntoView({ behavior: 'smooth' });
    });
});
