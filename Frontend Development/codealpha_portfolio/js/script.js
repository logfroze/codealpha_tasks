/**
 * Alan Hanma Umar — Developer Portfolio JavaScript
 * Clean, Simple & Modern Vanilla JavaScript (ES6)
 * Zero external libraries or framework dependencies
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================
     1. THEME SWITCHER (DARK / LIGHT)
     =================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }

  /* ===================================================
     2. MOBILE NAVIGATION MENU TOGGLE
     =================================================== */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navToggleIcon = navToggle ? navToggle.querySelector('i') : null;

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);

      if (navToggleIcon) {
        if (isOpen) {
          navToggleIcon.classList.remove('fa-bars');
          navToggleIcon.classList.add('fa-xmark');
        } else {
          navToggleIcon.classList.remove('fa-xmark');
          navToggleIcon.classList.add('fa-bars');
        }
      }
    });

    // Close mobile menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          if (navToggleIcon) {
            navToggleIcon.classList.remove('fa-xmark');
            navToggleIcon.classList.add('fa-bars');
          }
        }
      });
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        if (navToggleIcon) {
          navToggleIcon.classList.remove('fa-xmark');
          navToggleIcon.classList.add('fa-bars');
        }
      }
    });
  }

  /* ===================================================
     3. SCROLLSPY (ACTIVE NAV LINK ON SCROLL)
     =================================================== */
  const sections = document.querySelectorAll('section[id]');

  function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-menu a[href*='${sectionId}']`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', scrollActive, { passive: true });

  /* ===================================================
     4. PROJECTS SECTION CATEGORY FILTERING
     =================================================== */
  const projectFilterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ===================================================
     5. INTERNSHIPS PROGRAM FILTER SWITCHER
     =================================================== */
  const programTabBtns = document.querySelectorAll('.program-tab-btn');
  const internshipCards = document.querySelectorAll('.intern-project-card');

  programTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      programTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedProgram = btn.getAttribute('data-program');

      internshipCards.forEach(card => {
        const cardProgram = card.getAttribute('data-program');

        if (selectedProgram === 'all' || cardProgram === selectedProgram) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ===================================================
     6. CONTACT FORM SUBMISSION
     =================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const senderName = nameInput ? nameInput.value.trim() : 'there';

      // Feedback message
      if (formStatus) {
        formStatus.className = 'form-status success';
        formStatus.innerHTML = `
          <i class="fa-solid fa-circle-check"></i>
          Thank you, <strong>${escapeHtml(senderName)}</strong>! Your message has been received. I'll get back to you shortly.
        `;

        contactForm.reset();

        // Clear feedback after 6 seconds
        setTimeout(() => {
          formStatus.className = 'form-status';
          formStatus.textContent = '';
        }, 6000);
      }
    });
  }

  // Helper function to escape HTML
  function escapeHtml(string) {
    return String(string).replace(/[&<>"']/g, function (s) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[s];
    });
  }

  /* ===================================================
     7. BACK TO TOP BUTTON
     =================================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
