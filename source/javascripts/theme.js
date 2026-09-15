/**
 * Theme toggle
 * The page follows the OS light/dark preference by default. The masthead toggle
 * flips to the other theme; a choice that differs from the OS preference is saved
 * in localStorage, and one that matches it clears the saved value so the page
 * goes back to following the OS. The inline script in the layout <head> applies
 * the saved value before first paint.
 */

(function() {
  'use strict';

  var STORAGE_KEY = 'theme';
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function systemTheme() {
    return media && media.matches ? 'dark' : 'light';
  }

  function savedTheme() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch (e) {
      return null;
    }
  }

  function currentTheme() {
    var attr = root.getAttribute('data-theme');
    return attr === 'light' || attr === 'dark' ? attr : systemTheme();
  }

  function setTheme(theme) {
    var followsSystem = theme === systemTheme();
    try {
      if (followsSystem) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, theme);
      }
    } catch (e) {}

    if (followsSystem) {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    updateToggles();
    reloadDisqus();
  }

  function toggleTheme() {
    setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  }

  function updateToggles() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    var buttons = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].textContent = next === 'dark' ? 'Dark' : 'Light';
      buttons[i].setAttribute('aria-label', 'Switch to ' + next + ' theme');
      buttons[i].hidden = false;
    }
  }

  // Disqus picks its light/dark scheme from the page colors when it loads.
  function reloadDisqus() {
    if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
      window.DISQUS.reset({ reload: true });
    }
  }

  function init() {
    var buttons = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', toggleTheme);
    }
    updateToggles();

    if (media) {
      var onChange = function() {
        if (!savedTheme()) root.removeAttribute('data-theme');
        updateToggles();
        reloadDisqus();
      };
      if (media.addEventListener) {
        media.addEventListener('change', onChange);
      } else if (media.addListener) {
        media.addListener(onChange);
      }
    }
  }

  window.ThemeToggle = { currentTheme: currentTheme, setTheme: setTheme, toggleTheme: toggleTheme, init: init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
