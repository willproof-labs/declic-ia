# Architecture — Déclic IA

## Principes

- **Site statique :** HTML5 sémantique, CSS moderne avec custom properties, modules JavaScript natifs. Pas de framework, de backend, d’API, de base de données ni de dépendance externe à l’exécution.
- **Amélioration progressive :** tout le contenu et la navigation par ancres fonctionnent sans JavaScript. Le JavaScript ajoute le menu repliable, la gestion du repli vidéo et la validation du formulaire de démonstration.
- **Une responsabilité par fichier :** chaque fichier CSS ou JS couvre un seul domaine, pour pouvoir corriger un point sans toucher au reste.
- **Chemins relatifs uniquement :** le site fonctionne à la racine d’un domaine comme sous un sous-chemin GitHub Pages. Seule exception : les balises Open Graph `og:url` et `og:image` du `<head>`, qui exigent l’adresse absolue du site publié. L’image de partage est `assets/images/og-declic-ia.jpg` (1200 × 627), un montage des illustrations 01 et 05 sans régénération.

## Page

`index.html` est l’unique document. Ordre des sections et ancres :

| # | Section | Ancre | Illustration |
|---|---|---|---|
| 1 | Header (marque, navigation, CTA) | — | — |
| 2 | Hero | `#accueil` | `05_EQUIPE_AGILE_FLUIDE.jpeg` |
| 3 | Vidéo | `#video` | poster `06_DECLIC_IA_ENDCARD.jpeg` |
| 4 | Problème | `#pourquoi` | `01_PROBLEME_EQUIPE_AGILE.jpeg` |
| 5 | Notre approche | `#methode` | `03_IA_REORGANISE_BACKLOG.jpeg` + `04_VALIDATION_HUMAINE.jpeg` |
| 6 | Quatre formations | `#formations` | `02_FORMATION_DECLIC_IA.jpeg` |
| 7 | Prolongez votre parcours | `#parcours` | — |
| 8 | Bénéfices | `#benefices` | `05_EQUIPE_AGILE_FLUIDE.jpeg` (décorative, `alt=""`) |
| 9 | CTA final et formulaire de démonstration | `#contact` | — |
| 10 | Footer | — | — |

La navigation principale contient : Pourquoi ? (`#pourquoi`), Notre méthode (`#methode`), Formations (`#formations`), La vidéo (`#video`), plus le bouton « Découvrir les formations » (`#formations`).

**Noms des fichiers 03 et 04.** À la réception, les noms des deux fichiers étaient inversés par rapport à leur contenu. Ils ont été corrigés sans modifier les images :
- `03_IA_REORGANISE_BACKLOG.jpeg` montre l’information éparse transformée en liste structurée ;
- `04_VALIDATION_HUMAINE.jpeg` montre la liste de contrôle et la vérification humaine.

## CSS

Ordre de chargement, du plus général au plus spécifique :

| Fichier | Responsabilité |
|---|---|
| `tokens.css` | Uniquement des custom properties : palette, rôles de couleur M3, typographie (polices système), espacements, formes, élévations, mouvement, largeurs, z-index. |
| `base.css` | Reset léger, éléments HTML, typographie globale, liens, focus visible, lien d’évitement, `.visually-hidden`, défilement doux et neutralisation des animations selon `prefers-reduced-motion`. |
| `layout.css` | Container, header, navigation, sections, hero, blocs deux colonnes, grilles intrinsèques (`auto-fit` / `minmax`), footer. Mobile-first. |
| `components.css` | Boutons, bouton de menu, méthode (schéma), formations (parcours progressif), certifications, bénéfices, vidéo, formulaire, footer. |
| `responsive.css` | Uniquement des adaptations par breakpoint. |

**Breakpoints :** `< 48rem` pour le mobile, `≥ 48rem` pour la tablette, `≥ 64rem` pour le desktop. Le menu repliable s’applique sous `64rem`.

**Couleurs.** Elles sont tirées de l’endcard `06` et vérifiées pour le contraste WCAG AA :

| Rôle | Couleur | Contraste |
|---|---|---|
| Fond ivoire | `#F4F1EC` | — |
| Bleu marine (titres) | `#0B1D3A` | 14,9:1 |
| Bleu vif (actions) | `#0D63CF` | 5,0:1 sur ivoire, 5,7:1 en texte blanc |
| Corail clair | `#E0857F` | réservé au décoratif |
| Corail foncé (texte, erreurs) | `#B03A33` | 5,3:1 |

**Codage visuel de la méthode.**
- La préparation (méthode, contexte) est sur fond neutre.
- L’IA générative est en bleu vif.
- La vérification et la décision humaine sont en bleu marine.

## JavaScript

`index.html` charge un seul module : `js/main.js` (`type="module"`, donc différé). `main.js` charge chaque module par import dynamique, chacun avec sa propre gestion d’erreur. Si un module ne peut pas être chargé ou échoue à l’exécution, les autres fonctionnent quand même. Il ne charge `form-demo.js` que si le formulaire est présent.

Contrats entre HTML, CSS et JS :

| Module | Éléments utilisés | Comportement |
|---|---|---|
| `navigation.js` | `.site-header`, `.nav-toggle[aria-controls]`, `#navigation-principale` | Retire `hidden` du bouton et pose `data-nav-ready` sur le header. Bascule `aria-expanded`. Ferme le menu avec Échap (focus rendu au bouton), au clic sur un lien, au clic extérieur, quand le focus sort du header et au passage en desktop. Le défilement doux reste en CSS. |
| `video.js` | `[data-video]`, `video`, `[data-video-fallback]` | Si `assets/video/declic-ia.mp4` ne peut pas être lu : masque le lecteur et affiche le message de repli (`role="status"`), puis pose `data-video-state="unavailable"`. |
| `form-demo.js` | `[data-demo-form]` (`data-success-message`), `input[type=email]`, `[data-form-error]`, `[data-form-status]` | Valide dans le navigateur (champ requis, format email) avec `aria-invalid` et un message relié par `aria-describedby`. Si l’adresse est valide, affiche le message de confirmation et vide le champ. |

**Le formulaire ne peut rien envoyer.** Il utilise `method="dialog"`, donc même sans JavaScript, sa soumission ne déclenche aucune requête. Avec JavaScript, `submit` est annulé. Aucune donnée n’est stockée (ni cookie, ni localStorage, ni sessionStorage) et aucune mesure d’audience n’est faite.

## Déploiement

Le contenu publié se limite à `index.html`, `css/`, `js/`, `assets/` et `.nojekyll`. Il est copié dans `_site/` :
- **GitHub Pages :** par le workflow `.github/workflows/deploy-pages.yml` (actions officielles) ;
- **Cloudflare Pages :** par sa commande de build (même copie, dossier de sortie `_site`).

La documentation du dépôt n’est pas publiée. Chaque fichier publié doit rester sous 25 MiB, la limite de Cloudflare Pages ; le workflow le vérifie.
