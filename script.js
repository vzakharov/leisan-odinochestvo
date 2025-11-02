document.addEventListener('DOMContentLoaded', function() {
    checkResetFlag();
    initFacilitatorOrder();
    initAnimations();
    initCarousel();
});

function checkResetFlag() {
    if (window.location.hash === '#reset') {
        localStorage.removeItem('animationsShown');
        history.replaceState(null, null, ' ');
    }
}

function initFacilitatorOrder() {
    const facilitatorsGrid = document.querySelector('.facilitators-grid');
    if (!facilitatorsGrid) return;

    const facilitators = facilitatorsGrid.querySelectorAll('.facilitator');
    if (facilitators.length !== 2) return;

    // Flip a coin to decide order on each page load
    const shouldReverse = Math.random() < 0.5;

    // Reorder DOM elements if needed
    if (shouldReverse) {
        // Move the second facilitator before the first one
        facilitatorsGrid.insertBefore(facilitators[1], facilitators[0]);
    }
}

function haveAnimationsBeenShown() {
    return localStorage.getItem('animationsShown') === 'true';
}

function markAnimationsAsShown() {
    localStorage.setItem('animationsShown', 'true');
}

function initAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                animateSection(section);
                observer.unobserve(section);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.block').forEach(block => {
        observer.observe(block);
    });
}

function animateSection(section) {
    const lines = section.querySelectorAll('.line');
    const welcome = section.querySelector('.welcome');
    const skipAnimations = haveAnimationsBeenShown();
    
    if (skipAnimations) {
        lines.forEach(line => {
            line.classList.add('visible');
        });
        if (welcome) {
            welcome.classList.add('visible');
        }
    } else {
        lines.forEach((line, index) => {
            const delay = line.dataset.delay || (index * 400);
            setTimeout(() => {
                line.classList.add('visible');
            }, parseInt(delay));
        });

        if (welcome) {
            const delay = welcome.dataset.delay || (lines.length * 400);
            setTimeout(() => {
                welcome.classList.add('visible');
            }, parseInt(delay));
        }
        
        if (section.classList.contains('block-invitation')) {
            const maxDelay = welcome ? parseInt(welcome.dataset.delay || (lines.length * 400)) : 
                            (lines.length > 0 ? parseInt(lines[lines.length - 1].dataset.delay || ((lines.length - 1) * 400)) : 0);
            setTimeout(() => {
                markAnimationsAsShown();
            }, maxDelay + 500);
        }
    }
}

function initCarousel() {
    const images = document.querySelectorAll('.carousel-image');
    const dots = document.querySelectorAll('.dot');

    if (!images.length || !dots.length) return;

    let currentIndex = 0;
    const intervalTime = 6000;

    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    // Auto-advance carousel
    let autoAdvance = setInterval(nextImage, intervalTime);

    // Click handlers for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showImage(currentIndex);
            // Reset auto-advance timer
            clearInterval(autoAdvance);
            autoAdvance = setInterval(nextImage, intervalTime);
        });
    });
}
