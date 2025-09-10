/* ===== Advanced Animation Controller ===== */
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        this.initIntersectionObserver();
        this.initScrollAnimations();
        this.initHoverAnimations();
        this.initClickAnimations();
    }

    /* ===== Intersection Observer for Scroll Animations ===== */
    initIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.triggerScrollAnimation(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            this.observers.set('scroll', observer);
        }
    }

    /* ===== Scroll Animations ===== */
    initScrollAnimations() {
        // Add scroll reveal class to elements
        $('.scroll-reveal').each((index, element) => {
            this.observers.get('scroll')?.observe(element);
        });
    }

    /* ===== Hover Animations ===== */
    initHoverAnimations() {
        // User items hover
        $('.user-item').hover(
            (e) => this.animateUserHover(e.currentTarget, 'in'),
            (e) => this.animateUserHover(e.currentTarget, 'out')
        );

        // Button hover
        $('.btn-hover-lift').hover(
            (e) => this.animateButtonHover(e.currentTarget, 'in'),
            (e) => this.animateButtonHover(e.currentTarget, 'out')
        );

        // Card hover
        $('.card-hover-lift').hover(
            (e) => this.animateCardHover(e.currentTarget, 'in'),
            (e) => this.animateCardHover(e.currentTarget, 'out')
        );
    }

    /* ===== Click Animations ===== */
    initClickAnimations() {
        // Button click ripple effect
        $('.btn-ripple').on('click', (e) => {
            this.createRippleEffect(e);
        });

        // Message send animation
        $('.btn-send').on('click', (e) => {
            this.animateSendButton(e.currentTarget);
        });
    }

    /* ===== Trigger Scroll Animation ===== */
    triggerScrollAnimation(element) {
        if (typeof gsap !== 'undefined') {
            const animationType = element.dataset.animation || 'fadeUp';
            const delay = parseFloat(element.dataset.delay) || 0;
            
            switch (animationType) {
                case 'fadeUp':
                    gsap.fromTo(element, 
                        { opacity: 0, y: 50 },
                        { opacity: 1, y: 0, duration: 0.8, delay, ease: "power2.out" }
                    );
                    break;
                case 'fadeLeft':
                    gsap.fromTo(element, 
                        { opacity: 0, x: -50 },
                        { opacity: 1, x: 0, duration: 0.8, delay, ease: "power2.out" }
                    );
                    break;
                case 'fadeRight':
                    gsap.fromTo(element, 
                        { opacity: 0, x: 50 },
                        { opacity: 1, x: 0, duration: 0.8, delay, ease: "power2.out" }
                    );
                    break;
                case 'scaleUp':
                    gsap.fromTo(element, 
                        { opacity: 0, scale: 0.8 },
                        { opacity: 1, scale: 1, duration: 0.8, delay, ease: "back.out(1.7)" }
                    );
                    break;
                case 'rotateIn':
                    gsap.fromTo(element, 
                        { opacity: 0, rotation: 180, scale: 0.5 },
                        { opacity: 1, rotation: 0, scale: 1, duration: 1, delay, ease: "back.out(1.7)" }
                    );
                    break;
            }
        }
    }

    /* ===== Animate User Hover ===== */
    animateUserHover(element, direction) {
        if (typeof gsap !== 'undefined') {
            if (direction === 'in') {
                gsap.to(element, {
                    x: -8,
                    scale: 1.02,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                gsap.to(element, {
                    x: 0,
                    scale: 1,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        }
    }

    /* ===== Animate Button Hover ===== */
    animateButtonHover(element, direction) {
        if (typeof gsap !== 'undefined') {
            if (direction === 'in') {
                gsap.to(element, {
                    y: -3,
                    scale: 1.05,
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                gsap.to(element, {
                    y: 0,
                    scale: 1,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        }
    }

    /* ===== Animate Card Hover ===== */
    animateCardHover(element, direction) {
        if (typeof gsap !== 'undefined') {
            if (direction === 'in') {
                gsap.to(element, {
                    y: -5,
                    scale: 1.02,
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                gsap.to(element, {
                    y: 0,
                    scale: 1,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        }
    }

    /* ===== Create Ripple Effect ===== */
    createRippleEffect(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /* ===== Animate Send Button ===== */
    animateSendButton(element) {
        if (typeof gsap !== 'undefined') {
            gsap.to(element, {
                scale: 0.9,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        }
    }

    /* ===== Animate Message Appearance ===== */
    animateMessageAppearance(element) {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(element, 
                { opacity: 0, y: 20, scale: 0.9 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    duration: 0.4, 
                    ease: "back.out(1.7)" 
                }
            );
        }
    }

    /* ===== Animate Typing Indicator ===== */
    animateTypingIndicator(element) {
        if (typeof gsap !== 'undefined') {
            const dots = element.querySelectorAll('.typing-dot');
            dots.forEach((dot, index) => {
                gsap.to(dot, {
                    y: -10,
                    duration: 0.6,
                    delay: index * 0.2,
                    yoyo: true,
                    repeat: -1,
                    ease: "power2.inOut"
                });
            });
        }
    }

    /* ===== Animate Success Message ===== */
    animateSuccess(element) {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(element, 
                { scale: 0.3, opacity: 0 },
                { 
                    scale: 1.1, 
                    opacity: 1, 
                    duration: 0.3,
                    ease: "back.out(1.7)"
                }
            );
            
            gsap.to(element, {
                scale: 1,
                duration: 0.2,
                delay: 0.3
            });
        }
    }

    /* ===== Animate Error Message ===== */
    animateError(element) {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(element, 
                { x: 0 },
                { 
                    x: -5, 
                    duration: 0.1,
                    repeat: 5,
                    yoyo: true,
                    ease: "power2.inOut"
                }
            );
        }
    }

    /* ===== Animate Page Transition ===== */
    animatePageTransition(direction = 'in') {
        if (typeof gsap !== 'undefined') {
            const container = $('.chat-container');
            
            if (direction === 'in') {
                gsap.fromTo(container, 
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
                );
            } else {
                gsap.to(container, {
                    opacity: 0,
                    y: -30,
                    duration: 0.5,
                    ease: "power2.in"
                });
            }
        }
    }

    /* ===== Animate Loading Spinner ===== */
    animateLoadingSpinner(element) {
        if (typeof gsap !== 'undefined') {
            gsap.to(element, {
                rotation: 360,
                duration: 1,
                repeat: -1,
                ease: "none"
            });
        }
    }

    /* ===== Animate Pulse Effect ===== */
    animatePulse(element) {
        if (typeof gsap !== 'undefined') {
            gsap.to(element, {
                scale: 1.1,
                duration: 0.5,
                yoyo: true,
                repeat: -1,
                ease: "power2.inOut"
            });
        }
    }

    /* ===== Animate Bounce Effect ===== */
    animateBounce(element) {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(element, 
                { y: 0 },
                { 
                    y: -10, 
                    duration: 0.3,
                    yoyo: true,
                    repeat: 2,
                    ease: "power2.out"
                }
            );
        }
    }

    /* ===== Animate Shake Effect ===== */
    animateShake(element) {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(element, 
                { x: 0 },
                { 
                    x: -5, 
                    duration: 0.1,
                    repeat: 5,
                    yoyo: true,
                    ease: "power2.inOut"
                }
            );
        }
    }

    /* ===== Animate Fade In ===== */
    animateFadeIn(element, delay = 0) {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(element, 
                { opacity: 0 },
                { opacity: 1, duration: 0.6, delay, ease: "power2.out" }
            );
        }
    }

    /* ===== Animate Slide Up ===== */
    animateSlideUp(element, delay = 0) {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(element, 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, delay, ease: "power2.out" }
            );
        }
    }

    /* ===== Animate Scale In ===== */
    animateScaleIn(element, delay = 0) {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(element, 
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.6, delay, ease: "back.out(1.7)" }
            );
        }
    }

    /* ===== Create Timeline ===== */
    createTimeline() {
        if (typeof gsap !== 'undefined') {
            return gsap.timeline();
        }
        return null;
    }

    /* ===== Animate Sequence ===== */
    animateSequence(elements, animationType = 'fadeUp', stagger = 0.1) {
        if (typeof gsap !== 'undefined') {
            const tl = this.createTimeline();
            
            elements.forEach((element, index) => {
                const delay = index * stagger;
                
                switch (animationType) {
                    case 'fadeUp':
                        tl.fromTo(element, 
                            { opacity: 0, y: 30 },
                            { opacity: 1, y: 0, duration: 0.6, delay, ease: "power2.out" }
                        );
                        break;
                    case 'fadeLeft':
                        tl.fromTo(element, 
                            { opacity: 0, x: -30 },
                            { opacity: 1, x: 0, duration: 0.6, delay, ease: "power2.out" }
                        );
                        break;
                    case 'fadeRight':
                        tl.fromTo(element, 
                            { opacity: 0, x: 30 },
                            { opacity: 1, x: 0, duration: 0.6, delay, ease: "power2.out" }
                        );
                        break;
                    case 'scaleUp':
                        tl.fromTo(element, 
                            { opacity: 0, scale: 0.8 },
                            { opacity: 1, scale: 1, duration: 0.6, delay, ease: "back.out(1.7)" }
                        );
                        break;
                }
            });
        }
    }

    /* ===== Cleanup ===== */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animations.clear();
    }
}

/* ===== CSS for Ripple Effect ===== */
const rippleCSS = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

/* ===== Initialize Animation Controller ===== */
$(document).ready(function() {
    window.animationController = new AnimationController();
});

/* ===== Export for global use ===== */
window.AnimationController = AnimationController;
