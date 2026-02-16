window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    const progress = document.querySelector('.loader-progress');
    
    progress.style.width = '100%';
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1000);
    }, 1500);
});

const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

window.addEventListener('mousemove', function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

document.querySelectorAll('a, button, .artist-card').forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.backgroundColor = 'rgba(0, 240, 255, 0.1)';
        cursorOutline.style.borderColor = 'transparent';
    });
    link.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
        cursorOutline.style.borderColor = '#00f0ff';
    });
});

const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];

function init() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    stars = [];
    for(let i = 0; i < 800; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * width
        });
    }
}

function draw() {
    ctx.fillStyle = "#030303";
    ctx.fillRect(0, 0, width, height);
    
    stars.forEach(star => {
        let x = (star.x - width / 2) * (width / star.z);
        let y = (star.y - height / 2) * (width / star.z);
        
        let size = (1 - star.z / width) * 3;
        let opacity = (1 - star.z / width);
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height / 2, size, 0, Math.PI * 2);
        ctx.fill();
        
        star.z -= 0.5; 
        
        if (star.z <= 0) {
            star.z = width;
            star.x = Math.random() * width;
            star.y = Math.random() * height;
        }
    });
    
    requestAnimationFrame(draw);
}

window.addEventListener('resize', init);
init();
draw();

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

document.querySelectorAll('.artist-card').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.8s ease-out';
    observer.observe(el);
});