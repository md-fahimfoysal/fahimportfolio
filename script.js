document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  
  try {
    // Set current year in footer
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
      currentYear.textContent = new Date().getFullYear();
    }

    const cvDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const cvDateHeader = document.getElementById('cv-date');
    if (cvDateHeader) {
      cvDateHeader.textContent = cvDate;
    }

    // ===== Semester Tabs (Accessible) =====
    const semesterTabs = document.querySelectorAll('.semester-tab');
    const semesterPanels = document.querySelectorAll('.semester-panel');

    function activateSemester(semNum) {
      try {
        semesterTabs.forEach(t => {
          const isActive = t.getAttribute('data-sem') === String(semNum);
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', isActive);
          t.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        semesterPanels.forEach(panel => {
          const isActive = panel.getAttribute('data-sem') === String(semNum);
          panel.classList.toggle('active', isActive);
          panel.setAttribute('aria-hidden', !isActive);
          panel.style.display = isActive ? 'block' : 'none';
        });
      } catch (e) {
        console.warn('Semester activation error:', e);
      }
    }

    semesterTabs.forEach(tab => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', tab.classList.contains('active'));
      
      // Click handler
      tab.addEventListener('click', function() {
        const semNum = this.getAttribute('data-sem');
        if (semNum) activateSemester(semNum);
      });
      
      // Keyboard support (arrow keys)
      tab.addEventListener('keydown', function(e) {
        const tabs = Array.from(semesterTabs);
        const currentIndex = tabs.indexOf(this);
        let nextTab = null;
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          nextTab = tabs[currentIndex + 1] || tabs[0];
          e.preventDefault();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          nextTab = tabs[currentIndex - 1] || tabs[tabs.length - 1];
          e.preventDefault();
        }
        
        if (nextTab) {
          nextTab.focus();
          const semNum = nextTab.getAttribute('data-sem');
          if (semNum) activateSemester(semNum);
        }
      });
    });

    if (semesterPanels.length > 0) {
      semesterPanels.forEach(panel => {
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-hidden', !panel.classList.contains('active'));
      });
      
      const firstPanel = semesterPanels[0];
      const initialSem = firstPanel.getAttribute('data-sem') || '1';
      activateSemester(initialSem);
    }
  } catch (e) {
    console.warn('Semester tabs initialization error:', e);
  }

  // ===== Pages & Navigation (Accessible) =====
  try {
    const navLinks = document.querySelectorAll('.navbar nav ul li a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  } catch (e) {
    console.warn('Navigation initialization error:', e);
  }

  // ===== Smooth Scroll (Accessible) =====
  try {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        try {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            target.focus();
          }
          
          const navUl = document.querySelector('.navbar nav ul');
          const hamburger = document.querySelector('.hamburger');
          if (navUl && navUl.classList.contains('active')) {
            navUl.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
          }
        } catch (err) {
          console.warn('Smooth scroll error:', err);
        }
      });
    });
  } catch (e) {
    console.warn('Smooth scroll initialization error:', e);
  }

  // ===== Mobile Menu (Accessible) =====
  try {
    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('.navbar nav ul');
    
    if (hamburger && navUl) {
      hamburger.setAttribute('aria-label', 'Toggle navigation menu');
      hamburger.setAttribute('aria-expanded', 'false');
      navUl.setAttribute('role', 'navigation');
      
      hamburger.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navUl.classList.toggle('active');
        hamburger.classList.toggle('active');
      });

      // Close menu when clicking on a link
      document.querySelectorAll('.navbar nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 768) {
            hamburger.setAttribute('aria-expanded', 'false');
            navUl.classList.remove('active');
            hamburger.classList.remove('active');
          }
        });
      });
    }
  } catch (e) {
    console.warn('Mobile menu initialization error:', e);
  }

  // ===== Navbar Scroll Effect (Throttled & Optimized) =====
  try {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      let scrollTimeout;
      let lastScrollY = 0;
      
      window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (Math.abs(currentScrollY - lastScrollY) > 50) {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            if (currentScrollY > 50) {
              navbar.classList.add('scrolled');
            } else {
              navbar.classList.remove('scrolled');
            }
            lastScrollY = currentScrollY;
          }, 100);
        }
      }, { passive: true });
    }
  } catch (e) {
    console.warn('Navbar scroll effect error:', e);
  }

  // ===== Scroll Reveal Animation (Performance Optimized) =====
  try {
    const revealElements = document.querySelectorAll(
      '.achievement-card, .research-card, .project-card, .activity-card, .contact-card, .about-image, .about-content, .value-item, .semester-panel, .course-item'
    );

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    revealElements.forEach(el => {
      el.classList.add('reveal');
      el.setAttribute('data-reveal', 'pending');
    });
    
    if (prefersReducedMotion) {
      revealElements.forEach(el => {
        el.classList.add('active');
        el.setAttribute('data-reveal', 'active');
      });
    } else if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.setAttribute('data-reveal', 'active');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback for browsers without IntersectionObserver
      revealElements.forEach(el => {
        el.classList.add('active');
        el.setAttribute('data-reveal', 'active');
      });
    }
  } catch (e) {
    console.warn('Scroll reveal animation error:', e);
  }

  // ===== Project Filtering (Optimized & Accessible) =====
  try {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
      // Initialize all project cards as visible on page load
      projectCards.forEach(card => {
        card.classList.add('visible');
        card.setAttribute('data-filtered', 'visible');
      });

      filterBtns.forEach((btn, index) => {
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');

        btn.addEventListener('click', function() {
          try {
            filterBtns.forEach(b => {
              b.classList.remove('active');
              b.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            const filter = this.getAttribute('data-filter');
            
            // Batch DOM updates to prevent layout thrashing
            requestAnimationFrame(() => {
              projectCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                const matches = filter === 'all' || category.includes(filter);
                
                if (matches) {
                  card.style.display = 'block';
                  card.setAttribute('data-filtered', 'visible');
                  // Trigger reflow only once
                  void card.offsetHeight;
                  card.classList.add('visible');
                } else {
                  card.classList.remove('visible');
                  card.setAttribute('data-filtered', 'hidden');
                  // Use CSS transition to hide
                  setTimeout(() => {
                    if (!card.classList.contains('visible')) {
                      card.style.display = 'none';
                    }
                  }, 300);
                }
              });
            });
          } catch (err) {
            console.warn('Filter button click error:', err);
          }
        });
      });
    }
  } catch (e) {
    console.warn('Project filtering initialization error:', e);
  }

  // ===== Contact Form Handling (Safe & Accessible) =====
  try {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
      contactForm.setAttribute('novalidate', 'true');
      formStatus.setAttribute('role', 'alert');
      formStatus.setAttribute('aria-live', 'polite');

      contactForm.addEventListener('submit', function(event) {
        try {
          event.preventDefault();

          const formData = new FormData(contactForm);
          const name = String(formData.get('name') || '').trim();
          const email = String(formData.get('email') || '').trim();
          const topic = String(formData.get('topic') || 'General Contact').trim();
          const message = String(formData.get('message') || '').trim();

          if (!name || !email || !message) {
            formStatus.textContent = 'Please fill out your name, email, and message.';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            return;
          }

          const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

          if (!emailIsValid) {
            formStatus.textContent = 'Please enter a valid email address.';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            return;
          }

          const subject = `Portfolio Contact: ${topic || 'General Contact'}`;
          const body = `Name: ${name}\nEmail: ${email}\nTopic: ${topic || 'General Contact'}\n\nMessage:\n${message}`;

          const mailtoLink = `mailto:mdfahim.foysal.mail@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

          formStatus.textContent = 'Preparing your email client...';
          formStatus.className = 'form-status';
          formStatus.style.display = 'block';

          window.location.href = mailtoLink;

          setTimeout(() => {
            formStatus.textContent = 'Your email draft is ready. Please send it to complete the message.';
            formStatus.className = 'form-status success';
            formStatus.style.display = 'block';
            contactForm.reset();
          }, 250);
        } catch (err) {
          console.warn('Form submission error:', err);
          formStatus.textContent = 'An error occurred. Please try again.';
          formStatus.className = 'form-status error';
          formStatus.style.display = 'block';
        }
      });

      // Add input validation feedback
      const inputs = contactForm.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
          e.preventDefault();
          formStatus.textContent = 'Please fill in all required fields correctly.';
          formStatus.className = 'form-status error';
          formStatus.style.display = 'block';
        });
      });
    }
  } catch (e) {
    console.warn('Contact form initialization error:', e);
  }

  // ===== Download CV Button =====
  try {
    const downloadBtn = document.getElementById('downloadCV');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function(e) {
        try {
          e.preventDefault();
          window.open('cv.html?print=1', '_blank');
        } catch (err) {
          console.warn('Download CV error:', err);
        }
      });
    }

    if (document.body.classList.contains('cv-page') && window.location.search.includes('print=1')) {
      window.setTimeout(() => {
        try {
          window.print();
        } catch (err) {
          console.warn('Print error:', err);
        }
      }, 400);
    }
  } catch (e) {
    console.warn('CV button initialization error:', e);
  }

  // ===== Active Nav Link on Scroll =====
  try {
    const sections = document.querySelectorAll('section[id]');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    window.addEventListener('scroll', function() {
      let current = '';
      const scrollPos = window.scrollY + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      document.querySelectorAll('.navbar nav ul li a').forEach(link => {
        const href = link.getAttribute('href');
        const pageFile = href && href.includes('.html') ? href : null;

        link.style.opacity = '0.85';
        link.style.background = 'transparent';

        if (pageFile === currentPage) {
          link.style.opacity = '1';
          link.style.background = 'rgba(255, 255, 255, 0.15)';
        }

        if (href === '#' + current) {
          link.style.opacity = '1';
          link.style.background = 'rgba(255, 255, 255, 0.15)';
        }
      });
    }, { passive: true });
  } catch (e) {
    console.warn('Nav scroll tracking error:', e);
  }

  // ===== Console Message =====
  if (console && console.log) {
    console.log('%c MD Fahim Foysal Portfolio %c Ready ',
      'background: #1a237e; color: white; padding: 8px 12px; border-radius: 4px 0 0 4px; font-weight: bold;',
      'background: #4caf50; color: white; padding: 8px 12px; border-radius: 0 4px 4px 0;'
    );
  }
});

