/* ============================================================
   ECOLO AFRICA TOGO — JavaScript
   Features: Navigation, Animations, Stats Counter, Form
============================================================ */

'use strict';

/* ---- Wait for DOM ---- */
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     LUCIDE ICONS INIT
  ============================================================ */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ============================================================
     DYNAMIC YEAR
  ============================================================ */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ============================================================
     NAVBAR — Scroll Behavior
  ============================================================ */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ============================================================
     NAVBAR — Active Link on Scroll
  ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ============================================================
     HAMBURGER / MOBILE MENU
  ============================================================ */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ============================================================
     SMOOTH SCROLL — All Anchor Links
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 70; // navbar height
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     SCROLL REVEAL ANIMATIONS
  ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for multiple siblings
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.children].filter(el =>
              el.classList.contains('reveal') ||
              el.classList.contains('reveal-left') ||
              el.classList.contains('reveal-right')
            )
          : [];
        const index = siblings.indexOf(entry.target);
        const delay = Math.min(index * 90, 500); // cap at 500ms

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ============================================================
     STATS COUNTER ANIMATION
  ============================================================ */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 2000; // ms
    const step     = 16;   // ~60fps
    const steps    = duration / step;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      // Format large numbers with thousands separator
      el.textContent = Math.floor(current).toLocaleString('fr-FR');
    }, step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));

  /* ============================================================
     CONTACT FORM — Validation & Feedback
  ============================================================ */
  const contactForm = document.getElementById('contactForm');
  const formMsg     = document.getElementById('formMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Clear previous message
      formMsg.className = 'form-msg';
      formMsg.textContent = '';

      // Validate
      if (!name || !email || !message) {
        formMsg.classList.add('error');
        formMsg.textContent = '⚠ Veuillez remplir tous les champs obligatoires.';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formMsg.classList.add('error');
        formMsg.textContent = '⚠ Veuillez entrer une adresse e-mail valide.';
        return;
      }

      // Simulate sending (static site)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Envoi en cours...';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        lucide.createIcons(); // Re-render icons after reset

        formMsg.classList.add('success');
        formMsg.innerHTML = '✅ Merci ! Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.';

        // Scroll to message
        formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-hide after 6s
        setTimeout(() => {
          formMsg.className = 'form-msg';
          formMsg.textContent = '';
        }, 6000);
      }, 1500);
    });
  }

  /* ============================================================
     SCROLL TO TOP BUTTON
  ============================================================ */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================================
     GALLERY — Lightbox Effect
  ============================================================ */
  const galleryItems = document.querySelectorAll('.gallery-item');

  // Create lightbox
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.92);
    z-index: 2000;
    align-items: center;
    justify-content: center;
    padding: 20px;
    cursor: zoom-out;
    backdrop-filter: blur(8px);
  `;

  const lightboxImg = document.createElement('img');
  lightboxImg.style.cssText = `
    max-width: 90vw;
    max-height: 85vh;
    border-radius: 12px;
    object-fit: contain;
    box-shadow: 0 20px 80px rgba(0,0,0,0.8);
    transform: scale(0.9);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  `;

  const lightboxCaption = document.createElement('div');
  lightboxCaption.style.cssText = `
    position: absolute;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255,255,255,0.85);
    font-size: 0.9rem;
    font-weight: 500;
    background: rgba(0,0,0,0.5);
    padding: 8px 20px;
    border-radius: 50px;
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 24px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    font-family: sans-serif;
  `;

  closeBtn.addEventListener('mouseover', () => {
    closeBtn.style.background = 'rgba(255,255,255,0.25)';
  });
  closeBtn.addEventListener('mouseout', () => {
    closeBtn.style.background = 'rgba(255,255,255,0.12)';
  });

  lightbox.appendChild(lightboxImg);
  lightbox.appendChild(lightboxCaption);
  lightbox.appendChild(closeBtn);
  document.body.appendChild(lightbox);

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxCaption.textContent = alt;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      lightboxImg.style.transform = 'scale(1)';
    });
  }

  function closeLightbox() {
    lightboxImg.style.transform = 'scale(0.9)';
    setTimeout(() => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-overlay span');
      if (img) openLightbox(img.src, caption ? caption.textContent : img.alt);
    });
    item.style.cursor = 'zoom-in';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  closeBtn.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
      closeLightbox();
    }
  });

  /* ============================================================
     HERO PARALLAX (subtle, performance-safe)
  ============================================================ */
  const heroImg = document.querySelector('.hero-img');

  if (heroImg && window.matchMedia('(min-width: 768px)').matches) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          heroImg.style.transform = `translateY(${scrollY * 0.3}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============================================================
     SERVICE CARDS — Tilt on hover (desktop only)
  ============================================================ */
  if (window.matchMedia('(min-width: 768px)').matches) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left - rect.width  / 2;
        const y      = e.clientY - rect.top  - rect.height / 2;
        const tiltX  = (y / rect.height) * 6;
        const tiltY  = -(x / rect.width) * 6;

        card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        card.style.transformOrigin = 'center center';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
        setTimeout(() => {
          card.style.transition = '';
        }, 400);
      });
    });
  }

  /* ============================================================
     SPINNING LOADER KEYFRAME
  ============================================================ */
  const spinStyle = document.createElement('style');
  spinStyle.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
  document.head.appendChild(spinStyle);

  /* ============================================================
     TERMS NAV — Smooth Highlight Active Section
  ============================================================ */
  const termsSections = document.querySelectorAll('.terms-section');
  const termsNavLinks = document.querySelectorAll('.terms-nav ul li a');

  if (termsSections.length && termsNavLinks.length) {
    const termsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          termsNavLinks.forEach(link => {
            link.style.color = '';
            link.style.background = '';
            link.style.paddingLeft = '';
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = '#2d7a3a';
              link.style.background = '#e8f5e9';
              link.style.paddingLeft = '16px';
            }
          });
        }
      });
    }, { threshold: 0.5 });

    termsSections.forEach(section => termsObserver.observe(section));
  }

  /* ============================================================
     PERFORMANCE: Lazy Image Loading Fallback
  ============================================================ */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (!('loading' in HTMLImageElement.prototype)) {
      img.src = img.dataset.src || img.src;
    }
  });

  console.log('%c🌿 ECOLO AFRICA TOGO', 'color:#2d7a3a;font-size:16px;font-weight:bold;');
  console.log('%cSite web chargé avec succès.', 'color:#3a9a4a;font-size:12px;');
});
