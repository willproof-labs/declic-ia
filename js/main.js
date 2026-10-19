/* ==========================================================================
   Déclic IA — Point d'entrée
   Initialise uniquement les modules nécessaires. Chaque module est chargé
   et démarré indépendamment (import dynamique + try/catch) : si l'un ne
   peut pas être chargé ou échoue à l'exécution, les autres fonctionnent.
   La page reste entièrement utilisable sans JavaScript.
   ========================================================================== */

const MODULES = [
  { name: 'navigation', path: './navigation.js', init: 'initNavigation' },
  { name: 'video', path: './video.js', init: 'initVideo' },
  // Le formulaire n'est chargé que s'il est présent dans la page.
  { name: 'form-demo', path: './form-demo.js', init: 'initDemoForm', when: '[data-demo-form]' },
];

for (const { name, path, init, when } of MODULES) {
  if (when && !document.querySelector(when)) continue;

  import(path)
    .then((module) => module[init]())
    .catch((error) => {
      console.error(`[Déclic IA] Module « ${name} » indisponible.`, error);
    });
}
