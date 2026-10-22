# Checklist QA — Déclic IA

Cocher chaque point avant une mise en production. Les vérifications automatisées faites pendant la réalisation sont rappelées en fin de document.

## Contenu

- [ ] Les dix sections sont présentes, dans l’ordre : header, hero, vidéo, problème, approche, formations, parcours, bénéfices, CTA final, footer.
- [ ] Aucune section ajoutée en dehors de ce périmètre.
- [ ] Les quatre formations sont exactes : 01 Découvrir, 02 Augmenter, 03 Transformer, 04 Créer, avec leurs intitulés « Déclic IA — … ».
- [ ] Il y a trois certifications tierces seulement, chacune avec sa mention de non-affiliation, sans logo.
- [ ] Aucune certification « Déclic IA ».
- [ ] Aucun témoignage, client, prix, statistique, adresse ni partenariat.
- [ ] Le positionnement est respecté : l’IA propose et structure, l’humain vérifie et décide.
- [ ] Le footer contient la mention « Site fictif réalisé dans le cadre d’un exercice de formation. ».

## Technique

- [ ] Tous les liens internes (`#pourquoi`, `#methode`, `#formations`, `#video`, `#accueil`, `#contenu`) mènent à une cible existante.
- [ ] Tous les chemins sont relatifs : aucun `/` initial, aucun nom d’hôte, aucune adresse `localhost`. Seule exception admise : `og:url` et `og:image`, qui exigent l’adresse absolue du site publié.
- [ ] L’aperçu de partage est correct dans le LinkedIn Post Inspector : titre, description et image `og-declic-ia.jpg` (1200 × 627).
- [ ] La vidéo est servie depuis `assets/video/declic-ia.mp4` uniquement.
- [ ] Aucune ressource externe requise (polices, scripts, CDN, analytics).
- [ ] Aucun backend ni API.
- [ ] La console est sans erreur provenant du code du site.

## Accessibilité

- [ ] Toute la page se parcourt au clavier, y compris le menu mobile : Entrée/Espace ouvre, Échap ferme et rend le focus.
- [ ] Le focus est visible sur tous les éléments interactifs, y compris sur le bandeau bleu marine.
- [ ] Les titres sont bien hiérarchisés : un seul H1, puis H2 et H3.
- [ ] Les textes alternatifs sont présents et pertinents ; l’image décorative des bénéfices a `alt=""`.
- [ ] Les contrastes sont au niveau AA ; le corail clair n’est jamais utilisé pour du texte.
- [ ] `prefers-reduced-motion` est respecté : défilement instantané, transitions neutralisées.
- [ ] Le formulaire a un label explicite, une erreur reliée par `aria-describedby` et `aria-invalid`, et une confirmation dans une région `role="status"`.
- [ ] Le lien « Aller au contenu » est fonctionnel.

## Responsive

- [ ] Smartphone (~360 px) : menu repliable, boutons pleine largeur, frise verticale des formations.
- [ ] Tablette (~768 px) : illustrations de la méthode côte à côte, formations sur deux colonnes.
- [ ] Desktop (1366 / 1440 px) : hero en composition de l’endcard, schéma de méthode horizontal, formations en escalier.
- [ ] Aucun défilement horizontal, menu ouvert compris.
- [ ] La vidéo est en 16:9 à toutes les largeurs.

## Performance

- [ ] JavaScript minimal : quatre modules natifs, sans bibliothèque.
- [ ] Images non critiques en `loading="lazy"` ; l’image du hero en `fetchpriority="high"`.
- [ ] Toutes les images ont `width` et `height`, pour éviter les décalages de mise en page.
- [ ] La vidéo est en `preload="metadata"`, sans autoplay.

## Déploiement

- [ ] Le workflow `.github/workflows/deploy-pages.yml` utilise les actions officielles et des permissions minimales.
- [ ] `_site/` contient uniquement `index.html`, `css/`, `js/`, `assets/` et `.nojekyll`.
- [ ] `README.md`, `docs/`, `.github/` et `.gitignore` sont absents du contenu publié.
- [ ] Chaque fichier publié fait moins de 25 MiB (limite Cloudflare Pages).
- [ ] La source de GitHub Pages est réglée sur « GitHub Actions ».
- [ ] Les réglages Cloudflare Pages sont conformes au README : preset `None`, copie vers `_site`, sortie `_site`.
- [ ] Le site s’affiche correctement sous un sous-chemin (`https://<compte>.github.io/<depot>/`).

## Vérifications automatisées déjà réalisées

Elles ont été faites dans un navigateur headless, pendant la réalisation.

- **Lots 1–2 :**
  - aucun défilement horizontal à 360, 768, 1024 et 1440 px ;
  - toutes les ancres trouvent leur cible ;
  - les six images se chargent.
- **Lot 3, navigation :** le menu mobile au clavier (Tab, Entrée, Espace, Échap, sortie du focus), la fermeture au clic sur un lien et le retour à l’état normal en desktop.
- **Lot 3, formulaire :**
  - erreurs et `aria-invalid` ;
  - message de succès exact ;
  - zéro requête réseau, URL inchangée ;
  - aucun stockage local ni cookie.
- **Lot 3, vidéo :**
  - le fichier local est demandé et servi en `video/mp4`, sans autoplay, avec `preload="metadata"` ;
  - un extrait de test se lit via le lecteur ;
  - si le fichier est absent (404 simulé), le repli s’affiche et le reste de la page reste fonctionnel.
- **Lot 3, autres :**
  - `prefers-reduced-motion` respecté dans les deux modes ;
  - navigation sans JavaScript fonctionnelle ;
  - aucune erreur console provenant du code.
- **Limite de l’environnement de test :** le Chromium headless utilisé ne lit pas le H.264. La lecture du MP4 lui-même doit donc être confirmée dans un navigateur courant (Chrome, Edge, Safari, Firefox).
