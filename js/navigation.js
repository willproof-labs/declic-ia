/* ==========================================================================
   Déclic IA — Navigation
   Menu repliable sous 64rem (le CSS est prêt dans responsive.css).
   Contrat avec le CSS :
     - retirer [hidden] du bouton .nav-toggle ;
     - poser [data-nav-ready] sur .site-header ;
     - basculer aria-expanded sur le bouton.
   Le défilement doux est géré en CSS (base.css, scroll-behavior,
   désactivé en prefers-reduced-motion) : il n'est pas dupliqué ici.
   ========================================================================== */

const DESKTOP_QUERY = '(min-width: 64rem)';

export function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggle = header?.querySelector('.nav-toggle');
  const nav = toggle && document.getElementById(toggle.getAttribute('aria-controls'));

  if (!header || !toggle || !nav) return;

  const desktop = window.matchMedia(DESKTOP_QUERY);
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  function setOpen(open, { returnFocus = false } = {}) {
    toggle.setAttribute('aria-expanded', String(open));
    if (!open && returnFocus) toggle.focus();
  }

  // Activation de l'amélioration progressive
  toggle.hidden = false;
  header.setAttribute('data-nav-ready', '');
  setOpen(false);

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  // Échap ferme le menu et rend le focus au bouton
  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen() && !desktop.matches) {
      event.preventDefault();
      setOpen(false, { returnFocus: true });
    }
  });

  // Un lien choisi ferme le menu (avant le saut d'ancre, pour un
  // positionnement correct sous le header collant)
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a') && !desktop.matches) setOpen(false);
  });

  // Clic hors du header : fermeture
  document.addEventListener('click', (event) => {
    if (isOpen() && !header.contains(event.target)) setOpen(false);
  });

  // Focus sorti du header au clavier (Tab après le dernier lien) : fermeture
  header.addEventListener('focusout', (event) => {
    if (isOpen() && event.relatedTarget && !header.contains(event.relatedTarget)) {
      setOpen(false);
    }
  });

  // Passage en desktop : état réinitialisé (le bouton y est masqué)
  desktop.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}
