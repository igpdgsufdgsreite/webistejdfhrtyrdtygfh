document.addEventListener("DOMContentLoaded", () => {
    
    const tlLoader = gsap.timeline();
    
    tlLoader.to(".loader-progress", {
        width: "100%",
        duration: 1.5,
        ease: "power2.inOut"
    })
    .to(".loader-content", {
        opacity: 0,
        duration: 0.5,
        delay: 0.2
    })
    .to("#loader", {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut",
        onComplete: () => {
            initHeroAnimations();
        }
    });

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);
    
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    function initHeroAnimations() {
        const tlHero = gsap.timeline();
        
        tlHero.fromTo(".reveal-text", 
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
        )
        .fromTo(".reveal-fade",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power2.out" },
            "-=0.8"
        );
    }

    const revealElements = document.querySelectorAll('.gs-reveal');
    
    revealElements.forEach((el) => {
        gsap.fromTo(el, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    gsap.to(".ambient-glow", {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    tsParticles.load("particles-js", {
        background: {
            color: { value: "transparent" }
        },
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: { enable: true, mode: "grab" },
                resize: true
            },
            modes: {
                grab: { distance: 140, links: { opacity: 0.5, color: "#4B0082" } }
            }
        },
        particles: {
            color: { value: "#ffffff" },
            links: {
                color: "#4B0082",
                distance: 150,
                enable: true,
                opacity: 0.1,
                width: 1
            },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 0.5,
                straight: false
            },
            number: {
                density: { enable: true, area: 800 },
                value: 40
            },
            opacity: { value: 0.2 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 2 } }
        },
        detectRetina: true
    });
});