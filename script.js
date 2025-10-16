document.addEventListener('DOMContentLoaded', function() {
    checkResetFlag();
    initAnimations();
    initFloatingImages();
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

function initFloatingImages() {
    const images = document.querySelectorAll('.floating-image');
    const contemplationSection = document.querySelector('.block-contemplation');
    
    if (!images.length || !contemplationSection) return;
    
    images.forEach((img, index) => {
        animateFloatingImage(img, index, contemplationSection);
    });
}

function animateFloatingImage(img, index, section) {
    const isMobile = window.innerWidth <= 768;
    const baseDelay = index * (isMobile ? 4000 : 6000);
    
    setTimeout(() => {
        startFloatingCycle(img, section, isMobile);
    }, baseDelay);
}

function startFloatingCycle(img, section, isMobile) {
    function cycle() {
        const sectionRect = section.getBoundingClientRect();
        const imgWidth = isMobile ? 220 : 360;
        const imgHeight = imgWidth * 0.67;
        
        const maxX = sectionRect.width - imgWidth;
        const maxY = sectionRect.height - imgHeight;
        
        // Create edge bias - 90% chance to appear in outer 25% of space
        const edgeZone = 0.2; // 20% from edges
        let startX, startY;
        
        if (Math.random() < 0.9) {
            // Appear near edges
            if (Math.random() < 0.8) {
                // Left or right edge
                startX = Math.random() < 0.5 ? 
                    Math.random() * (maxX * edgeZone) : 
                    maxX - Math.random() * (maxX * edgeZone);
                startY = Math.random() * maxY;
            } else {
                // Top or bottom edge
                startX = Math.random() * maxX;
                startY = Math.random() < 0.5 ? 
                    Math.random() * (maxY * edgeZone) : 
                    maxY - Math.random() * (maxY * edgeZone);
            }
        } else {
            // 10% chance to appear anywhere
            startX = Math.random() * maxX;
            startY = Math.random() * maxY;
        }
        
        const moveDistance = isMobile ? 30 : 60;
        const moveAngle = Math.random() * Math.PI * 2;
        const endX = startX + Math.cos(moveAngle) * moveDistance;
        const endY = startY + Math.sin(moveAngle) * moveDistance;
        
        img.style.left = startX + 'px';
        img.style.top = startY + 'px';
        img.style.transform = 'translate(0, 0)';
        img.style.transition = 'none';
        img.style.opacity = '0';
        
        setTimeout(() => {
            const cycleDuration = isMobile ? 8000 : 12000;
            const fadeInDuration = isMobile ? 2000 : 3000;
            const fadeOutDuration = isMobile ? 2000 : 3000;
            
            img.style.transition = `opacity ${fadeInDuration}ms ease-in-out, transform ${cycleDuration}ms ease-in-out`;
            img.style.opacity = isMobile ? '0.25' : '0.35';
            img.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
            
            setTimeout(() => {
                img.style.transition = `opacity ${fadeOutDuration}ms ease-in-out`;
                img.style.opacity = '0';
            }, cycleDuration - fadeOutDuration);
            
            const totalCycleTime = cycleDuration + (isMobile ? 3000 : 5000);
            setTimeout(() => {
                cycle();
            }, totalCycleTime);
        }, 50);
    }
    
    cycle();
}
