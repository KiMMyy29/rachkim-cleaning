// Navbar scroll shrink
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.padding = window.scrollY > 60 ? '0.6rem 5rem' : '1rem 5rem';
  });
}

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Set active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// Helper — form to plain object
function formToObject(form) {
  const obj = {};
  new FormData(form).forEach((val, key) => { obj[key] = val; });
  return obj;
}

// Helper — submit a form via fetch JSON
async function submitForm(formId, endpoint, alertId, btnText) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('.form-submit');
    const alertEl = document.getElementById(alertId);
    btn.disabled = true;
    btn.textContent = 'Sending...';
    alertEl.className = 'alert';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formToObject(this)),
      });
      const data = await res.json();
      alertEl.className = 'alert ' + (data.success ? 'success' : 'error') + ' show';
      alertEl.textContent = data.message;
      if (data.success) this.reset();
    } catch {
      alertEl.className = 'alert error show';
      alertEl.textContent = 'Something went wrong. Please call or WhatsApp us directly.';
    }
    btn.disabled = false;
    btn.textContent = btnText;
    alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

submitForm('contactForm', '/api/send-contact', 'contact-alert', 'Send Message');
submitForm('quoteForm', '/api/send-quote', 'quote-alert', 'Request My Free Quote');
