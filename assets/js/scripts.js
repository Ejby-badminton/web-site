var body = document.querySelector('body')
var menuTrigger = document.querySelector('#toggle-main-menu-mobile');
var menuContainer = document.querySelector('#main-menu-mobile');

menuTrigger.onclick = function() {
    menuContainer.classList.toggle('open');
    menuTrigger.classList.toggle('is-active')
    body.classList.toggle('lock-scroll')
}

// Ensure document downloads open in new tabs without manual HTML tweaking
var docLinks = document.querySelectorAll('a[href^="/assets/docs/"], a[href^="' + window.location.origin + '/assets/docs/"]');
docLinks.forEach(function(link) {
    link.setAttribute('target', '_blank');
    var rel = link.getAttribute('rel') || '';
    if (!rel.includes('noopener')) {
        rel = (rel + ' noopener').trim();
    }
    link.setAttribute('rel', rel);
});
