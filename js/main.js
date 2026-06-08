/* =====================================================
   Building Xpert — Main JavaScript
   buildingxpert.in
   ===================================================== */

/* ===== MOBILE VIEWPORT HEIGHT FIX ===== */
(function() {
  function setVH() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }
  setVH();
  window.addEventListener('resize', setVH, { passive: true });
  window.addEventListener('orientationchange', function() { setTimeout(setVH, 300); });
})();

/* ===== HAMBURGER TOGGLE ===== */
function closeMenu() {
  var nav = document.getElementById('navLinks');
  var ham = document.getElementById('hamburger');
  if (!nav || !ham) return;
  nav.classList.remove('open');
  ham.classList.remove('open');
  document.body.style.overflow = '';
}

function toggleMenu() {
  var nav = document.getElementById('navLinks');
  var ham = document.getElementById('hamburger');
  var isOpen = nav.classList.toggle('open');
  ham.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

/* ===== WHATSAPP CHAT POPUP (10s delay) ===== */
(function(){
  const popup = document.getElementById('waChatPopup');
  if (!popup) return;
  if (sessionStorage.getItem('waDismissed')) return;
  setTimeout(() => { popup.classList.add('visible'); }, 10000);
})();

function dismissWaPopup() {
  const popup = document.getElementById('waChatPopup');
  if (popup) { popup.classList.remove('visible'); }
  sessionStorage.setItem('waDismissed', '1');
}

/* ===== HERO IMAGE SLIDER ===== */
const slides = document.querySelectorAll('.hero-slide');
const dotsContainer = document.getElementById('slideDots');
const slideLabel = document.getElementById('slideLabel');
const heroTitle = document.getElementById('heroTitle');
const heroDesc = document.getElementById('heroDesc');
let currentSlide = 0;
let sliderInterval;

// Per-slide content — order matches slide-1, slide-2, slide-3
const slideContent = [
  {
    label: 'Commercial Interior & Furniture',
    title: 'Xpert in  <em>Commercial Interior</em> and <em>Furniture</em>',
    desc:  'Premium commercial interiors and custom furniture solutions crafted for offices, showrooms, and hospitality spaces across Chennai — free consultation, expert execution.'
  },
  {
    label: 'Construction & Civil Renovation',
    title: 'Xpert Solution for <em>Construction</em> and <em>Civil Renovation</em>',
    desc:  'End-to-end construction and civil renovation services — from structural repairs to full building makeovers. Trusted craftsmanship, on-time delivery across Chennai.'
  },
  {
    label: 'Painting & Waterproofing',
    title: 'Painting <em>and</em> <em>Waterproofing</em> Xpert',
    desc:  'Professional painting and waterproofing services across Chennai. Free inspection, expert workmanship, and guaranteed results — protecting your building inside and out.'
  }
];

slides.forEach((slide, i) => {
  const dot = document.createElement('button');
  dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function updateHeroContent(index) {
  const c = slideContent[index];
  slideLabel.classList.remove('visible');
  heroTitle.style.opacity = '0';
  heroDesc.style.opacity  = '0';
  setTimeout(() => {
    slideLabel.textContent        = c.label;
    heroTitle.innerHTML           = c.title;
    heroDesc.textContent          = c.desc;
    heroTitle.style.animation     = 'none';
    heroDesc.style.animation      = 'none';
    heroTitle.style.opacity       = '1';
    heroDesc.style.opacity        = '1';
    slideLabel.classList.add('visible');
  }, 400);
}

function goToSlide(index) {
  if (index === currentSlide) return;
  const prevSlide = currentSlide;
  slides[prevSlide].classList.remove('active');
  slides[prevSlide].classList.add('exit');
  dotsContainer.querySelectorAll('.slide-dot')[prevSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dotsContainer.querySelectorAll('.slide-dot')[currentSlide].classList.add('active');
  updateHeroContent(currentSlide);
  setTimeout(() => { slides[prevSlide].classList.remove('exit'); }, 1000);
  resetInterval();
}

function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
function resetInterval() { clearInterval(sliderInterval); sliderInterval = setInterval(nextSlide, 5000); }

// Add transition style for smooth fade
heroTitle.style.transition = 'opacity 0.4s ease';
heroDesc.style.transition  = 'opacity 0.4s ease';

setTimeout(() => { slideLabel.classList.add('visible'); }, 800);
sliderInterval = setInterval(nextSlide, 5000);

// After initial animations finish, lock hero elements so they don't hide on slide change
setTimeout(() => {
  const heroSection = document.querySelector('.hero');
  if (heroSection) heroSection.classList.add('hero-loaded');
}, 1200);

/* ===== SCROLL REVEAL ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      closeMenu();
      setTimeout(function() {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  });
});

/* ===== LIGHTBOX ===== */
function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(e) {
  if (!e || e.target !== document.getElementById('lightbox-img')) {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ===== CONTACT FORM — BACKEND SUBMIT ===== */
// ⚠️ After deploying to Render, replace this URL with your actual Render URL
const BACKEND_URL = "https://building-xpert-backend.vercel.app/send-enquiry";

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  const name    = document.getElementById('fname').value.trim();
  const phone   = document.getElementById('fphone').value.trim();
  const area    = document.getElementById('farea').value.trim();
  const service = document.getElementById('fservice').value;
  const message = document.getElementById('fmsg').value.trim();

  if (!name || !phone || !service) {
    formStatus.textContent = '⚠️ Please fill in Name, Phone, and Service.';
    formStatus.className = 'form-status error';
    return;
  }

  submitBtn.classList.add('sending');
  btnText.textContent = 'Sending...';
  formStatus.className = 'form-status';

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, area, service, message })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      formStatus.textContent = '✅ Enquiry sent to Our Team! Our Team will call you shortly.';
      formStatus.className = 'form-status success';
      submitBtn.classList.add('sent');
      btnText.textContent = 'Sent ✓';
      form.reset();
    } else {
      throw new Error(result.detail || 'Server error');
    }
  } catch (err) {
    formStatus.textContent = '❌ Could not send. Please call 97109 08050 directly.';
    formStatus.className = 'form-status error';
    btnText.textContent = 'Send Enquiry →';
  }

  submitBtn.classList.remove('sending');
});