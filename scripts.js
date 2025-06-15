const slides = document.getElementById('slides');
const moreSection = document.getElementById('more-section');
const boxSlide = document.getElementById('box-slide');
const boxMore = document.getElementById('box-more');
let totalSlides = 0;
let currentIndex = 0;

fetch('data/projects.json').then(response => response.json()).then(projects => {
    totalSlides = projects.length + 1;

    projects.forEach((project, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        let titleNoSpaces = project.title.replace(/\s+/g, '');
        slide.id = titleNoSpaces + 'Slide';
        slide.innerHTML = `
        <div class="box">
        <h2>${project.title}</h2>
        <p>${project.short}</p>
        <button class="read-more" onclick="scrollDown(${index})">czytaj dalej</button>
        </div>`;
        slides.appendChild(slide);

        const more = document.createElement('div');
        more.className = 'more';
        more.id = titleNoSpaces + 'More';

        const techList = project.technologies.map(t => `<li>${t}</li>`).join('');

        const images = project.images.map(src => {
            return src ? `<img src="${src}" alt="${project.title}" >` : '';
        }).join('');

        const repo = project.repo ? `<a href="${project.repo}" target="_blank">Repozytorium</a></p>` : 'Brak Repozytorium';

        more.innerHTML = `
        <div class="box">
        <h2>${project.title}</h2>
        <p>${project.description}</p>
        <h4>Technologie:</h4>
        <ul>${techList}</ul>
        <div class='galery'>${images}</div>
        <div class='repo-link'>
        <p>Więcej dowiesz się na: <br>
        ${repo}
        </div>
        <button class="back" onclick="scrollToTop()">Powrót</button>
        </div>`;
        moreSection.appendChild(more);

    });
}).catch(err => { console.error(err) });

function updateSlidePosition() {
    const offset = -currentIndex * 100;
    slides.style.transform = `translateX(${offset}vw)`;
    moreSection.style.transform = `translateX(${offset}vw)`;
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlidePosition();
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlidePosition();
}

function scrollDown() {
    const offset = -currentIndex * 100;
    moreSection.style.transform = `translateX(${offset}vw)`;
    moreSection.scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
    slides.scrollIntoView({ behavior: 'smooth' });
}

//animated background

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width, height;

function resize() {
    width = window.innerWidth;
    height = document.documentElement.scrollHeight;

    canvas.width = width;
    canvas.height = height;
}

resize();
window.addEventListener('resize', resize);

const bubblesQuantity = 50;
const bubbles = [];

for (let i = 0; i < bubblesQuantity; i++) {
    bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 10 + 5,
        speed: Math.random() * 0.5 + 0.1,
        angle: Math.random() * Math.PI * 2,
        frequency: Math.random() * 0.05 + 0.01,
        amplitude: Math.random() * 3 + 2,
        baseX: 0,
    })
}

bubbles.forEach(b => b.baseX = b.x);

function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "blue";

    bubbles.forEach(bubble => {
        bubble.angle += bubble.frequency;
        bubble.x = bubble.baseX + Math.sin(bubble.angle) * bubble.amplitude;

        const gradient = ctx.createRadialGradient(
            bubble.x - bubble.radius * 0.3,
            bubble.y - bubble.radius * 0.3,
            bubble.radius * 0.1,
            bubble.x,
            bubble.y,
            bubble.radius
        );

        gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)"); // biały połysk
        gradient.addColorStop(0.4, "rgba(173, 216, 230, 0.15)"); // niebieskawy środek
        gradient.addColorStop(1, "rgba(173, 216, 230, 0.05)"); // przezroczysty brzeg

        ctx.fillStyle = gradient;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();


        bubble.y -= bubble.speed;

        if (bubble.y < 0) {
            bubble.y = height;
            bubble.x = Math.random() * width;
            bubble.radius = Math.random() * 10 + 5;
            bubble.speed = Math.random() * 0.5 + 0.1;
            bubble.amplitude = Math.random() * 3 + 2;
            bubble.frequency = Math.random() * 0.05 + 0.01;
            bubble.angle = Math.random() * Math.PI * 2;
        }
    });

    requestAnimationFrame(animate);
}

animate();
