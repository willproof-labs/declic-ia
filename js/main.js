/* ==========================================================================
   Déclic IA — Point d'entrée
   Initialise uniquement les modules nécessaires. Chaque module est isolé :
   une erreur dans l'un n'empêche pas les autres de fonctionner, et la page
   reste entièrement utilisable sans JavaScript.
   ========================================================================== */

import { initNavigation } from './navigation.js';
import { initVideo } from './video.js';

function safeInit(name, init) {
  try {
    init();
  } catch (error) {
    console.error(`[Déclic IA] Échec de l’initialisation du module « ${name} ».`, error);
  }
}

safeInit('navigation', initNavigation);
safeInit('video', initVideo);

// Le module du formulaire n'est chargé que si le formulaire est présent.
if (document.querySelector('[data-demo-form]')) {
  import('./form-demo.js')
    .then(({ initDemoForm }) => safeInit('form-demo', initDemoForm))
    .catch((error) => console.error('[Déclic IA] Module « form-demo » indisponible.', error));
}
