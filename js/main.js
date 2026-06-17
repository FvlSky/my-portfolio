/* ============================================================
   Maria Hanna Babasa — Portfolio JavaScript
   Features:
   - Contact form alert & validation
   - Dark / Light mode toggle
   - Active nav link on scroll
   - Scroll-triggered skill bar animations
   - Scroll-triggered reveal animations
   - Mobile hamburger menu
   ============================================================ */

/* ── WAIT FOR DOM ── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. THEME TOGGLE ── */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon   = document.getElementById('theme-icon');
  const body        = document.body;

  // Load saved preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeIcon.textContent = '🌙';
  }

  themeToggle.addEventListener('click', () => {
    const isLight = body.classList.toggle('light-mode');
    themeIcon.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
  });


  /* ── 2. HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });


  /* ── 3. ACTIVE NAV LINK ON SCROLL ── */
  const sections  = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-link');

  const activateNav = () => {
    const scrollY = window.scrollY + 80;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', activateNav, { passive: true });
  activateNav();


  /* ── 4. SKILL BAR ANIMATION ── */
  const skillFills   = document.querySelectorAll('.skill-bar-fill');
  let skillsAnimated = false;

  const animateSkillBars = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        skillFills.forEach(fill => {
          const targetWidth = fill.getAttribute('data-width');
          // Slight delay per bar for a staggered effect
          setTimeout(() => {
            fill.style.width = targetWidth + '%';
          }, 100);
        });
      }
    });
  };

  const skillSection = document.querySelector('#skills');
  if (skillSection) {
    const skillObserver = new IntersectionObserver(animateSkillBars, {
      threshold: 0.2
    });
    skillObserver.observe(skillSection);
  }


  /* ── 5. SCROLL REVEAL ANIMATIONS ── */
  const revealElements = document.querySelectorAll(
    '.about-card, .project-card, .contact-form-wrap, .contact-info, .skills-col'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 80); // stagger by 80ms each
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach(el => revealObserver.observe(el));


  /* ── 6. CONTACT FORM ── */
  const form    = document.getElementById('contact-form');
  const nameEl  = document.getElementById('contact-name');
  const emailEl = document.getElementById('contact-email');
  const msgEl   = document.getElementById('contact-message');

  // Helper: show/clear error on a field
  const setError = (input, msg) => {
    input.classList.add('invalid');
    let err = input.nextElementSibling;
    if (!err || !err.classList.contains('form-error')) {
      err = document.createElement('p');
      err.className = 'form-error';
      input.parentNode.insertBefore(err, input.nextSibling);
    }
    err.textContent = msg;
    err.classList.add('visible');
  };

  const clearError = (input) => {
    input.classList.remove('invalid');
    const err = input.nextElementSibling;
    if (err && err.classList.contains('form-error')) {
      err.classList.remove('visible');
    }
  };

  // Live validation on blur
  [nameEl, emailEl, msgEl].forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearError(input));
  });

  const validateField = (input) => {
    const value = input.value.trim();

    if (!value) {
      setError(input, 'This field is required.');
      return false;
    }

    if (input.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        setError(input, 'Please enter a valid email address.');
        return false;
      }
    }

    clearError(input);
    return true;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    const nameOk  = validateField(nameEl);
    const emailOk = validateField(emailEl);
    const msgOk   = validateField(msgEl);

    if (!nameOk || !emailOk || !msgOk) return;

    // All valid — show success alert
    const senderName = nameEl.value.trim();
    alert(
      `✅ Thank you for contacting me, ${senderName}!\n\n` +
      `I've received your message and will get back to you as soon as possible.\n\n` +
      `— Maria Hanna`
    );

    // Reset form
    form.reset();
    [nameEl, emailEl, msgEl].forEach(clearError);
  });


  /* ── 7. SMOOTH SCROLL POLISH (for older browsers) ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

}); // end DOMContentLoaded