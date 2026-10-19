/* ==========================================================================
   Déclic IA — Formulaire de démonstration
   Validation côté navigateur uniquement.
   Aucune requête réseau, aucun stockage (ni cookie, ni localStorage,
   ni sessionStorage), aucune mesure d'audience : la valeur saisie n'est
   jamais lue ailleurs que pour être validée, puis le champ est vidé.
   États d'accessibilité utilisés (préparés dans le HTML/CSS) :
     - aria-invalid="true" sur le champ en erreur ;
     - message d'erreur [data-form-error] relié par aria-describedby ;
     - confirmation dans [data-form-status] (role="status", aria-live).
   ========================================================================== */

const MESSAGES = {
  valueMissing: 'Saisissez votre email professionnel.',
  typeMismatch: 'Saisissez une adresse email valide, par exemple nom@exemple.fr.',
};

export function initDemoForm() {
  const form = document.querySelector('[data-demo-form]');
  const input = form?.querySelector('input[type="email"]');
  const error = form?.querySelector('[data-form-error]');
  const status = form?.querySelector('[data-form-status]');

  if (!form || !input || !error || !status) return;

  const successMessage = form.dataset.successMessage;

  // Messages d'erreur gérés par le script (bulles natives désactivées)
  form.noValidate = true;

  function errorFor(field) {
    if (field.validity.valueMissing) return MESSAGES.valueMissing;
    if (field.validity.typeMismatch || !field.validity.valid) return MESSAGES.typeMismatch;
    return '';
  }

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError() {
    error.textContent = '';
    error.hidden = true;
    input.removeAttribute('aria-invalid');
  }

  // Correction en direct, une fois l'erreur affichée
  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') !== 'true') return;
    const message = errorFor(input);
    if (message) showError(message);
    else clearError();
  });

  form.addEventListener('submit', (event) => {
    // Bloque toute soumission : rien ne quitte la page.
    event.preventDefault();

    input.value = input.value.trim();
    status.textContent = '';

    const message = errorFor(input);
    if (message) {
      showError(message);
      input.focus();
      return;
    }

    clearError();
    form.reset();

    // Vidé puis rempli au tour suivant pour que la confirmation soit
    // annoncée même lors d'une seconde soumission.
    requestAnimationFrame(() => {
      status.textContent = successMessage;
    });
  });
}
