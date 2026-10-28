// Indlæses med defer, så DOM'en er klar. Alle opslag er alligevel beskyttet
// med null-tjek, så en ændret skabelon ikke stopper resten af scriptet.
(function () {
  'use strict';

  // --- Mobilmenu -----------------------------------------------------------
  var body = document.querySelector('body');
  var menuTrigger = document.querySelector('#toggle-main-menu-mobile');
  var menuContainer = document.querySelector('#main-menu-mobile');

  if (menuTrigger && menuContainer && body) {
    menuTrigger.addEventListener('click', function () {
      var isOpen = menuContainer.classList.toggle('open');
      menuTrigger.classList.toggle('is-active', isOpen);
      body.classList.toggle('lock-scroll', isOpen);
      // Skærmlæsere får kun tilstanden at vide via aria-expanded.
      menuTrigger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // --- Tilbud-dropdown i topmenuen -----------------------------------------
  // CSS åbner dropdownen på :hover og :focus-within, hvilket dækker mus og
  // tastatur. Klik og berøring gjorde derimod ingenting, så knappen så ud til
  // at være i stykker på touch-skærme. Her tilføjes klik-tilstanden, uden at
  // CSS-adfærden ændres.
  var dropdownToggles = document.querySelectorAll('.main-menu__toggle');

  function closeDropdown(toggle, force) {
    var parent = toggle.parentElement;
    if (parent) {
      parent.classList.remove('open');
      // force bruges ved Escape: CSS'ens :focus-within ville ellers holde
      // dropdownen åben, fordi fokus netop er sendt tilbage til knappen.
      parent.classList.toggle('is-closed', Boolean(force));
    }
    toggle.setAttribute('aria-expanded', 'false');
  }

  function clearForcedClose(toggle) {
    var parent = toggle.parentElement;
    if (parent) {
      parent.classList.remove('is-closed');
    }
  }

  Array.prototype.forEach.call(dropdownToggles, function (toggle) {
    var parent = toggle.parentElement;
    if (!parent) {
      return;
    }

    toggle.addEventListener('click', function () {
      clearForcedClose(toggle);
      var isOpen = parent.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));

      // Kun én dropdown åben ad gangen.
      Array.prototype.forEach.call(dropdownToggles, function (other) {
        if (other !== toggle) {
          closeDropdown(other, false);
        }
      });
    });

    // Escape lukker og sender fokus tilbage til knappen, så tastaturbrugere
    // ikke efterlades inde i en skjult liste.
    parent.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeDropdown(toggle, true);
        toggle.focus();
      }
    });

    // Når musen eller fokus forlader menupunktet, skal den tvungne lukning
    // ophøre, så hover og tastatur virker normalt igen bagefter.
    parent.addEventListener('mouseleave', function () {
      clearForcedClose(toggle);
    });

    parent.addEventListener('focusout', function (event) {
      if (!parent.contains(event.relatedTarget)) {
        clearForcedClose(toggle);
      }
    });
  });

  // Klik uden for menuen lukker en åben dropdown.
  document.addEventListener('click', function (event) {
    Array.prototype.forEach.call(dropdownToggles, function (toggle) {
      var parent = toggle.parentElement;
      if (parent && !parent.contains(event.target)) {
        closeDropdown(toggle, false);
      }
    });
  });

  // --- Dokumenter åbnes i nyt faneblad -------------------------------------
  var docLinks = document.querySelectorAll(
    'a[href^="/assets/docs/"], a[href^="' + window.location.origin + '/assets/docs/"]'
  );

  Array.prototype.forEach.call(docLinks, function (link) {
    link.setAttribute('target', '_blank');
    var rel = link.getAttribute('rel') || '';
    if (rel.indexOf('noopener') === -1) {
      rel = (rel + ' noopener').trim();
    }
    link.setAttribute('rel', rel);
  });
})();
