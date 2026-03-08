document.addEventListener('DOMContentLoaded', () => {

    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    });

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

        const interactives = document.querySelectorAll('a, button, .artist-card, .release-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
        });
    }

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                
                if(entry.target.classList.contains('stats-grid')){
                    runCounters();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    reveals.forEach(reveal => revealOnScroll.observe(reveal));

    let countersRun = false;
    function runCounters() {
        if(countersRun) return;
        countersRun = true;
        const counters = document.querySelectorAll('.counter');
        const speed = 50;
        
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;
                
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 40);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    const releaseCards = document.querySelectorAll('.release-card');
    
    releaseCards.forEach(card => card.classList.add('show'));

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            releaseCards.forEach(card => {
                card.classList.remove('show');
                if (filterValue === 'all' || card.classList.contains(filterValue)) {
                    setTimeout(() => { card.classList.add('show'); }, 50);
                }
            });
        });
    });

    const artistCards = document.querySelectorAll('.artist-card');
    const modal = document.getElementById('artist-modal');
    const closeBtn = document.querySelector('.close-modal');
    const modalName = document.getElementById('modal-name');
    const modalBio = document.getElementById('modal-bio');
    const modalTrack = document.getElementById('modal-track');

    artistCards.forEach(card => {
        card.addEventListener('click', () => {
            modalName.innerText = card.getAttribute('data-name');
            modalBio.innerText = card.getAttribute('data-bio');
            modalTrack.innerText = card.getAttribute('data-track');
            modal.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (e) => {
        if (e.target === modal) { modal.style.display = 'none'; }
    });

    const playButtons = document.querySelectorAll('.play-btn');
    const mainPlayBtn = document.getElementById('main-play-btn');
    const visualizer = document.querySelector('.visualizer');
    const trackNameDisplay = document.querySelector('.track-name');
    let isPlaying = false;

    function togglePlay(trackName = "Unknown Track") {
        isPlaying = !isPlaying;
        if(isPlaying) {
            mainPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            visualizer.classList.add('playing');
            if(trackName !== "Unknown Track") trackNameDisplay.innerText = trackName;
        } else {
            mainPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            visualizer.classList.remove('playing');
        }
    }

    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            let tName = "Flux Exclusive Mix";
            const cardInfo = btn.closest('.release-card')?.querySelector('h3');
            if(cardInfo) tName = cardInfo.innerText;
            
            if(!isPlaying) {
                togglePlay(tName);
            } else if(trackNameDisplay.innerText !== tName) {
                trackNameDisplay.innerText = tName;
            } else {
                togglePlay();
            }
        });
    });

    mainPlayBtn.addEventListener('click', () => { togglePlay(trackNameDisplay.innerText); });

    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 245, 255, 0.5)';
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) { particles.push(new Particle()); }

    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 245, 255, ${1 - distance/120})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

});