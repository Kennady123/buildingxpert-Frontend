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
function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('navLinks').classList.toggle('open');
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
let currentSlide = 0;
let sliderInterval;

slides.forEach((slide, i) => {
  const dot = document.createElement('button');
  dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function goToSlide(index) {
  if (index === currentSlide) return;
  const prevSlide = currentSlide;
  slides[prevSlide].classList.remove('active');
  slides[prevSlide].classList.add('exit');
  dotsContainer.querySelectorAll('.slide-dot')[prevSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dotsContainer.querySelectorAll('.slide-dot')[currentSlide].classList.add('active');
  const label = slides[currentSlide].dataset.label;
  slideLabel.classList.remove('visible');
  setTimeout(() => { slideLabel.textContent = label; slideLabel.classList.add('visible'); }, 100);
  setTimeout(() => { slides[prevSlide].classList.remove('exit'); }, 1000);
  resetInterval();
}

function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
function resetInterval() { clearInterval(sliderInterval); sliderInterval = setInterval(nextSlide, 5000); }
setTimeout(() => { slideLabel.classList.add('visible'); }, 800);
sliderInterval = setInterval(nextSlide, 5000);

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
      document.getElementById('navLinks').classList.remove('open');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
const BACKEND_URL = "https://buildinxpert.onrender.com/send-enquiry";

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