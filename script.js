document.addEventListener('DOMContentLoaded', function() {
    checkResetFlag();
    initAnimations();
    initSlowScroll();
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

function initSlowScroll() {
    let isScrolling = false;
    let scrollTimeout;
    
    const smoothScrollSpeed = 0.7;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = Math.abs(distance) * smoothScrollSpeed;
                
                let start = null;
                
                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const progress = Math.min(timeElapsed / duration, 1);
                    
                    const ease = easeInOutCubic(progress);
                    window.scrollTo(0, startPosition + (distance * ease));
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }
                
                requestAnimationFrame(animation);
            }
        });
    });
    
    window.addEventListener('wheel', function(e) {
        if (!isScrolling) {
            isScrolling = true;
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 150);
    }, { passive: true });
}

function easeInOutCubic(t) {
    return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxSections = document.querySelectorAll('.block-invitation, .block-presence');
    
    parallaxSections.forEach(section => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        section.style.transform = `translateY(${yPos}px)`;
    });
}, { passive: true });

