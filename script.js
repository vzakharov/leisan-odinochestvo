document.addEventListener('DOMContentLoaded', function() {
    checkResetFlag();
    initAnimations();
});

function checkResetFlag() {
    if (window.location.hash === '#reset') {
        localStorage.removeItem('animationsShown');
        history.replaceState(null, null, ' ');
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
