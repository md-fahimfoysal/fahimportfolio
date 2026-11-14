(function () {
  'use strict';

  const translations = Object.assign({}, window.portfolioTranslations || {});

  const languages = {
    en: { label: 'English', locale: 'en', direction: 'ltr' },
    zh: { label: '中文', locale: 'zh-CN', direction: 'ltr' }
  };

  Object.assign(translations, window.portfolioExtraTranslations || {});

  function normalize(value) {
    return value.replace(/\s+/g, ' ').trim();
  }

  function translate(value, language) {
    const key = normalize(value);
    const entry = translations[key];
    if (language === 'en' || !entry || !entry[language]) return value;
    const leadingWhitespace = value.match(/^\s*/)[0];
    const trailingWhitespace = value.match(/\s*$/)[0];
    return leadingWhitespace + entry[language] + trailingWhitespace;
  }

  window.portfolioTranslate = function (value) {
    const selector = document.querySelector('.language-switcher');
    return translate(value, selector ? selector.value : 'en');
  };

  document.addEventListener('DOMContentLoaded', function () {
    const selector = document.querySelector('.language-switcher') || document.createElement('select');
    selector.className = 'language-switcher';
    selector.setAttribute('aria-label', 'Language');
    selector.title = 'Language';

    if (!selector.parentElement) {
      let navActions = document.querySelector('.nav-actions');
      const hamburger = document.querySelector('.navbar .hamburger');
      if (!navActions && hamburger) {
        navActions = document.createElement('div');
        navActions.className = 'nav-actions';
        const navContainer = hamburger.parentElement;
        const nav = navContainer.querySelector(':scope > nav');
        navContainer.insertBefore(navActions, nav ? nav.nextSibling : hamburger);
        navActions.appendChild(hamburger);
      }

      if (navActions) {
        navActions.insertBefore(selector, navActions.firstChild);
      } else {
        selector.classList.add('language-switcher--floating');
        document.body.appendChild(selector);
      }
    }

    selector.innerHTML = '';
    Object.keys(languages).forEach(function (code) {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = languages[code].label;
      selector.appendChild(option);
    });

    const textNodes = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement.closest('.language-switcher, script, style')) {
        textNodes.push({ node: node, original: node.nodeValue });
      }
    }

    const translatedAttributes = [];
    document.querySelectorAll('[placeholder], [aria-label], [title], img[alt]').forEach(function (element) {
      ['placeholder', 'aria-label', 'title', 'alt'].forEach(function (attribute) {
        if (element.hasAttribute(attribute)) {
          translatedAttributes.push({
            element: element,
            attribute: attribute,
            original: element.getAttribute(attribute)
          });
        }
      });
    });

    const originalTitle = document.title;
    const currentYear = document.getElementById('current-year');
    const cvDate = document.getElementById('cv-date');

    function applyLanguage(language) {
      const selected = languages[language] ? language : 'en';
      const config = languages[selected];
      document.documentElement.lang = config.locale;
      document.documentElement.dir = config.direction;
      document.body.classList.toggle('is-rtl', config.direction === 'rtl');
      document.body.dataset.language = selected;
      selector.value = selected;

      textNodes.forEach(function (item) {
        item.node.nodeValue = translate(item.original, selected);
      });
      translatedAttributes.forEach(function (item) {
        item.element.setAttribute(item.attribute, translate(item.original, selected));
      });
      document.title = translate(originalTitle, selected);

      if (currentYear) currentYear.textContent = new Date().getFullYear();
      if (cvDate) {
        cvDate.textContent = new Date().toLocaleDateString(config.locale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }

      window.dispatchEvent(new CustomEvent('portfolio-language-change', { detail: { language: selected } }));
    }

    selector.addEventListener('change', function () {
      const language = selector.value;
      applyLanguage(language);
      try {
        localStorage.setItem('preferredLang', language);
      } catch (error) {
        console.warn('Could not save preferred language:', error);
      }
    });

    let preferredLanguage = 'en';
    try {
      preferredLanguage = localStorage.getItem('preferredLang') || 'en';
    } catch (error) {
      console.warn('Could not read preferred language:', error);
    }
    applyLanguage(preferredLanguage);
  });
})();
