/* Portfolio — Ibrahima Mohamed Diarra. Source lisible : la version publiée est obscurcie. */
(function () {
  'use strict';

  if (window.top !== window.self) {
    document.documentElement.replaceChildren();
    return;
  }

const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  };
  animateRing();

  // Hover effects on interactive elements
  document.querySelectorAll('a, button, .btn, .about-card, .skill-category, .project-mockup, .bc-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });
}

// ============ NAVBAR SCROLL ============
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);

  if (!scrollProgress) return;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
  scrollProgress.style.width = progress + '%';
});

const profilePhoto = document.getElementById('profilePhoto');
const photoPlaceholder = document.getElementById('photoPlaceholder');
if (profilePhoto && photoPlaceholder) {
  const hideBrokenPhoto = () => {
    profilePhoto.style.display = 'none';
    photoPlaceholder.style.display = 'flex';
  };
  profilePhoto.addEventListener('error', hideBrokenPhoto);
  if (profilePhoto.complete && profilePhoto.naturalWidth === 0) hideBrokenPhoto();
}

// ============ TYPING EFFECT ============
const typingText = document.getElementById('typingText');
const phrases = [
  'Software Developer',
  'Bioinformatics Developer',
  'Full-Stack Developer',
  'AI Systems Builder',
  'Computational Biology'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

const type = () => {
  if (!typingText) return;
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typingText.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingText.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(type, delay);
};
setTimeout(type, 800);

// ============ AOS-LIKE SCROLL ANIMATIONS ============
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay) || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
);

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// ============ COUNTER ANIMATION ============
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCount = () => {
          current += step;
          if (current < target) {
            el.textContent = Math.floor(current).toLocaleString('fr-FR');
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = target.toLocaleString('fr-FR') + (target >= 1000 ? '+' : '');
          }
        };
        updateCount();
        countObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-num').forEach(el => countObserver.observe(el));

// ============ NAV BURGER ============
const navBurger = document.getElementById('navBurger');
const navLinks = document.querySelector('.nav-links');

if (navBurger) {
  navBurger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navBurger.classList.toggle('active');
  });
}

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const hash = this.getAttribute('href');
    if (!hash || hash.length < 2) return;
    let target = null;
    try {
      target = document.querySelector(hash);
    } catch {
      return;
    }
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============ NEURAL NETWORK CANVAS ============
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Particles representing neurons
const particles = [];
const PARTICLE_COUNT = Math.min(80, Math.floor((width * height) / 18000));
const MAX_DISTANCE = 140;

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.pulse = Math.random() * Math.PI * 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.pulse += 0.02;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    const pulseSize = this.size + Math.sin(this.pulse) * 0.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 255, 213, ${this.opacity})`;
    ctx.fill();

    // Glow
    ctx.beginPath();
    ctx.arc(this.x, this.y, pulseSize * 3, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, pulseSize * 3);
    gradient.addColorStop(0, `rgba(0, 255, 213, ${this.opacity * 0.3})`);
    gradient.addColorStop(1, 'rgba(0, 255, 213, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

const connectParticles = () => {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < MAX_DISTANCE) {
        const opacity = (1 - distance / MAX_DISTANCE) * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124, 92, 255, ${opacity})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
};

const animate = () => {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animate);
};
animate();
}

// ============ PARALLAX ON PHOTO ============
const photoWrapper = document.querySelector('.photo-wrapper');
if (photoWrapper) {
  document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 60;
    const y = (window.innerHeight / 2 - e.clientY) / 60;
    photoWrapper.style.transform = `translate(${x}px, ${y}px)`;
  });
}

// ============ CONSOLE MESSAGE ============
console.log('%c👋 Bienvenue !', 'color: #00ffd5; font-size: 24px; font-weight: bold;');
console.log('%cPortfolio d\'Ibrahima Mohamed Diarra', 'color: #7c5cff; font-size: 14px;');
console.log('%cIntéressé par le code ? Contactez-moi !', 'color: #ff3da6; font-size: 12px;');


// ===== PROJECT CAROUSELS =====
document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll('.project-slide'));
  if (!slides.length) return;
  const dots = Array.from(carousel.querySelectorAll('.project-carousel-dot'));
  const count = carousel.querySelector('.project-carousel-count');
  let index = 0;

  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    if (count) count.textContent = `${index + 1} / ${slides.length}`;
  };

  carousel.querySelector('.project-carousel-arrow.prev')?.addEventListener('click', () => show(index - 1));
  carousel.querySelector('.project-carousel-arrow.next')?.addEventListener('click', () => show(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
});
})();
