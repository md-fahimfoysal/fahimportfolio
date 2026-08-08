document.addEventListener('DOMContentLoaded', function() {
  
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // ===== Language Switching =====
  let currentLang = 'en';
  
  const langData = {};
  document.querySelectorAll('[data-en]').forEach(el => {
    const key = el.getAttribute('data-en');
    if (!langData[key]) langData[key] = {};
    langData[key].en = el.getAttribute('data-en');
    langData[key].bn = el.getAttribute('data-bn') || el.getAttribute('data-en');
    langData[key].zh = el.getAttribute('data-zh') || el.getAttribute('data-en');
  });
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      currentLang = lang;
      
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
          } else {
            el.textContent = text;
          }
        }
      });
      
      localStorage.setItem('preferredLang', lang);
    });
  });
  
  const savedLang = localStorage.getItem('preferredLang');
  if (savedLang && savedLang !== 'en') {
    const savedBtn = document.querySelector(`.lang-btn[data-lang="${savedLang}"]`);
    if (savedBtn) savedBtn.click();
  }

  // ===== Semester Tabs =====
  const semesterTabs = document.querySelectorAll('.semester-tab');
  const semesterPanels = document.querySelectorAll('.semester-panel');
  
  semesterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const semNum = this.getAttribute('data-sem');
      
      semesterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      semesterPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.getAttribute('data-sem') === semNum) {
          panel.classList.add('active');
        }
      });
    });
  });

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
      
      const navUl = document.querySelector('.navbar nav ul');
      const hamburger = document.querySelector('.hamburger');
      if (navUl.classList.contains('active')) {
        navUl.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  });

  // ===== Mobile Menu =====
  const hamburger = document.querySelector('.hamburger');
  const navUl = document.querySelector('.navbar nav ul');
  
  hamburger.addEventListener('click', function() {
    navUl.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // ===== Navbar Scroll Effect =====
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ===== Scroll Reveal Animation =====
  const revealElements = document.querySelectorAll(
    '.achievement-card, .research-card, .project-card, .activity-card, .contact-card, .about-image, .about-content, .value-item, .semester-panel, .course-item'
  );
  
  revealElements.forEach(el => {
    el.classList.add('reveal');
  });
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => revealObserver.observe(el));

  // ===== Project Filtering =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ===== Download CV Button =====
  const downloadBtn = document.getElementById('downloadCV');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      alert('CV download functionality will be available soon. Please contact me directly for a copy of my CV.');
    });
  }

  // ===== Active Nav Link on Scroll =====
  const sections = document.querySelectorAll('section[id]');
  
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
      link.style.opacity = '0.85';
      link.style.background = 'transparent';
      
      if (link.getAttribute('href') === '#' + current) {
        link.style.opacity = '1';
        link.style.background = 'rgba(255, 255, 255, 0.15)';
      }
    });
  });

  console.log('%c MD Fahim Foysal Portfolio %c Ready ',
    'background: #1a237e; color: white; padding: 8px 12px; border-radius: 4px 0 0 4px; font-weight: bold;',
    'background: #4caf50; color: white; padding: 8px 12px; border-radius: 0 4px 4px 0;'
  );
});
