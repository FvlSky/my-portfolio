/* ============================================================
   Maria Hanna Babasa — Portfolio JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. PROJECT CAROUSEL ── */
  const carousel = document.getElementById('projectsCarousel');
  const btnLeft  = document.querySelector('.carousel-btn-left');
  const btnRight = document.querySelector('.carousel-btn-right');

  function updateCarouselBtns() {
    const atStart = carousel.scrollLeft <= 4;
    const atEnd    = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 4;
    btnLeft.hidden  = atStart;
    btnRight.hidden = atEnd;
  }

  btnRight.addEventListener('click', () => {
    carousel.scrollLeft += carousel.clientWidth;
    setTimeout(updateCarouselBtns, 350);
  });

  btnLeft.addEventListener('click', () => {
    carousel.scrollLeft -= carousel.clientWidth;
    setTimeout(updateCarouselBtns, 350);
  });

  carousel.addEventListener('scroll', updateCarouselBtns, { passive: true });
  window.addEventListener('resize', updateCarouselBtns);
  updateCarouselBtns();


  /* ── 2. HAMBURGER MENU ── */
  const hamburger    = document.getElementById('hamburger');
  const navLinkLists = document.querySelectorAll('.nav-links');

  const setMenuOpen = (open) => {
    navLinkLists.forEach(list => list.classList.toggle('open', open));
    hamburger.setAttribute('aria-expanded', String(open));
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
  });

  navLinkLists.forEach(list => {
    list.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
  });


  /* ── 3. ACTIVE NAV LINK ON SCROLL ── */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const activateNav = () => {
    const scrollY = window.scrollY + 80;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach(link => link.classList.remove('active'));
        document.querySelectorAll(`.nav-link[href="#${id}"]`).forEach(link => link.classList.add('active'));
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
          setTimeout(() => {
            fill.style.width = targetWidth + '%';
          }, 100);
        });
      }
    });
  };

  const skillSection = document.querySelector('#skills');
  if (skillSection) {
    const skillObserver = new IntersectionObserver(animateSkillBars, { threshold: 0.2 });
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
          }, i * 80);
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

  [nameEl, emailEl, msgEl].forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearError(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameOk  = validateField(nameEl);
    const emailOk = validateField(emailEl);
    const msgOk   = validateField(msgEl);

    if (!nameOk || !emailOk || !msgOk) return;

    const senderName = nameEl.value.trim();
    alert(
      `✅ Thank you for contacting me, ${senderName}!\n\n` +
      `I've received your message and will get back to you as soon as possible.\n\n` +
      `— Maria Hanna`
    );

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

});