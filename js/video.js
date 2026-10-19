/* ==========================================================================
   Déclic IA — Vidéo locale
   Source unique : assets/video/declic-ia.mp4 (déclarée dans index.html).
   Aucune vidéo distante, aucun autoplay. Si le fichier local ne peut pas
   être chargé, le lecteur est masqué et le message de repli préparé dans
   le HTML ([data-video-fallback], role="status") est affiché.
   ========================================================================== */

export function initVideo() {
  const container = document.querySelector('[data-video]');
  const video = container?.querySelector('video');
  const fallback = container?.querySelector('[data-video-fallback]');

  if (!container || !video || !fallback) return;

  const frame = video.closest('.video__frame') || video;
  const sources = video.querySelectorAll('source');
  let failed = false;

  function showFallback() {
    if (failed) return;
    failed = true;
    video.pause();
    video.removeAttribute('controls');
    frame.hidden = true;
    fallback.hidden = false;
    container.setAttribute('data-video-state', 'unavailable');
  }

  // Erreur de chargement : émise sur la dernière <source>, ou sur <video>
  // si la source est indiquée directement.
  const lastSource = sources[sources.length - 1];
  lastSource?.addEventListener('error', showFallback);
  video.addEventListener('error', showFallback);

  // L'erreur a pu survenir avant le chargement du module (modules différés)
  if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
    showFallback();
  }
}
