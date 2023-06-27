window.addEventListener('DOMContentLoaded', () => {
    let sections = document.querySelectorAll('.content > div');
    if (window.innerWidth / window.innerHeight <= 1.1) {
        sections = [sections[0], sections[3]];
    }
    let currentSection = 0;
    let isScrolling = false;
    let startTouchY;

    window.updateCurrentSection = function (index) {
        currentSection = index;
        sections[currentSection].scrollIntoView({ behavior: 'smooth' });
    };

    function handleScroll(direction) {
        if (isScrolling) return;

        if (direction === 1 && currentSection < sections.length - 1) {
            currentSection++;
        } else if (direction === -1 && currentSection > 0) {
            currentSection--;
        }

        isScrolling = true;
        sections[currentSection].scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            isScrolling = false;
        }, 400);

        window.updateCurrentSection(currentSection);
    }

    // Mouse scroll event
    window.addEventListener('wheel', (event) => {
        event.preventDefault();
        const direction = event.deltaY > 0 ? 1 : -1;
        handleScroll(direction);
        window.setCurrentSection(currentSection);
    });

    // Touch event for mobile
    window.addEventListener('touchstart', (event) => {
        startTouchY = event.touches[0].clientY;
    });

    window.addEventListener('touchmove', (event) => {
        event.preventDefault();
        const direction = startTouchY - event.changedTouches[0].clientY > 0 ? 1 : -1;
        handleScroll(direction);
    });

    // Resize event
    window.addEventListener('resize', () => {
        // Recalculate sections if needed
        if (window.innerWidth / window.innerHeight <= 1.1) {
            sections = [sections[0], sections[3]];
        } else {
            sections = document.querySelectorAll('.content > div');
        }

        // Adjust currentSection if it exceeds the new sections length
        if (currentSection >= sections.length) {
            currentSection = sections.length - 1;
        }

        // Scroll to the updated current section
        sections[currentSection].scrollIntoView({ behavior: 'auto' });
    });
});


