# Déclic IA

Site vitrine statique de **Déclic IA**, organisme de formation **fictif**, réalisé dans le cadre d’un exercice de formation (assessment).

> L’IA au service de votre agilité

Le site est une page unique en HTML, CSS et JavaScript natifs. Il n’a ni dépendance, ni gestionnaire de paquets, ni étape de build applicative, ni backend.

---

## Structure

```text
declic-ia/
├── index.html                 Page unique, structure sémantique et contenus
├── css/
│   ├── tokens.css             Design tokens (couleurs, typo, espacements…)
│   ├── base.css               Reset, typographie, focus, accessibilité
│   ├── layout.css             Containers, header, sections, grilles
│   ├── components.css         Boutons, méthode, formations, vidéo, formulaire…
│   └── responsive.css         Adaptations par breakpoint uniquement
├── js/
│   ├── main.js                Point d’entrée (modules ES natifs)
│   ├── navigation.js          Menu repliable mobile / tablette
│   ├── video.js               Lecteur local et état de repli
│   └── form-demo.js           Formulaire de démonstration (aucun envoi)
├── assets/
│   ├── images/                Les six illustrations fournies
│   └── video/declic-ia.mp4    Vidéo locale
├── .github/workflows/deploy-pages.yml
├── docs/
│   ├── architecture.md        Architecture et contrats entre fichiers
│   └── qa-checklist.md        Liste de contrôle qualité
├── .nojekyll
├── .gitignore
└── README.md
```

Tous les chemins du site sont **relatifs** (`css/…`, `js/…`, `assets/…`). Le site fonctionne à la racine d’un domaine comme sous un sous-chemin (par exemple `https://<compte>.github.io/<depot>/`). Aucun nom d’hôte n’est écrit en dur.

---

## Contenu publié

Seul le contenu du site est publié :

```text
index.html  css/  js/  assets/  .nojekyll
```

`README.md`, `docs/`, `.github/` et `.gitignore` restent dans le dépôt mais ne sont **pas** mis en ligne. GitHub Actions et Cloudflare Pages utilisent la même copie vers un dossier `_site/`, ignoré par Git.

---

## Aperçu local (facultatif)

- **Sans serveur :** ouvrir `index.html` directement dans un navigateur affiche tout le contenu et permet la navigation par ancres. Les navigateurs bloquent cependant les modules JavaScript en `file://`, donc le menu mobile et le formulaire de démonstration restent inactifs dans ce mode.
- **Avec un serveur statique :** pour tester aussi le JavaScript, servir le dossier avec n’importe quel serveur de fichiers statiques déjà disponible sur la machine. Par exemple, si Python 3 est présent :

  ```sh
  python3 -m http.server 8000
  ```

  puis ouvrir `http://localhost:8000/`. Aucune installation n’est requise par le projet.

---

## Déploiement principal : GitHub Pages via GitHub Actions

Le workflow `.github/workflows/deploy-pages.yml` utilise uniquement les actions officielles :

| Étape | Action |
|---|---|
| Récupération du dépôt | `actions/checkout@v7` |
| Copie du contenu du site dans `_site/` et contrôles | commandes shell (`cp`, `test`, `find`) |
| Configuration Pages | `actions/configure-pages@v6` |
| Téléversement de l’artefact | `actions/upload-pages-artifact@v5` (`include-hidden-files: true` pour conserver `.nojekyll`) |
| Déploiement | `actions/deploy-pages@v5` |

Le workflow s’arrête en erreur dans trois cas :
- un élément attendu manque dans `_site/` ;
- de la documentation s’y trouve ;
- un fichier dépasse 25 MiB.

Les permissions se limitent à `contents: read`, `pages: write` et `id-token: write`.

### Mise en service

1. Pousser le projet sur la branche `main` du dépôt GitHub.
   - Si la branche par défaut porte un autre nom, adapter `branches: [main]` dans le workflow.
2. Dans le dépôt : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
3. Le workflow se lance à chaque push sur `main`. Il peut aussi être lancé à la main depuis l’onglet **Actions** (« Run workflow »).
4. L’adresse publiée s’affiche dans le résumé du job **Déployer** (environnement `github-pages`).

Aucun domaine personnalisé n’est configuré.

---

## Déploiement secondaire : Cloudflare Pages

Le même dépôt peut être servi par Cloudflare Pages, sans modification du code et sans Workers, Functions ni R2.

Dans le tableau de bord Cloudflare : **Workers & Pages → Créer → Pages → Connecter à Git**, choisir le dépôt, puis :

| Réglage | Valeur |
|---|---|
| Framework preset | `None` |
| Build command | `mkdir -p _site && cp -R index.html css js assets .nojekyll _site/` |
| Build output directory | `_site` |
| Root directory | *(vide — racine du dépôt)* |

La commande de build est une simple copie de fichiers, sans installation ni dépendance. Elle produit exactement le même contenu que le workflow GitHub.

**Limite par fichier.** Cloudflare Pages limite chaque fichier publié à **25 MiB**. `assets/video/declic-ia.mp4` pèse environ 8,3 Mo (8 730 444 octets). Toute nouvelle version de la vidéo doit rester sous cette limite (le workflow GitHub la vérifie aussi).

---

## Vidéo

- **Fichier :** local uniquement, `assets/video/declic-ia.mp4`. Aucune vidéo distante (YouTube, Vimeo…).
- **Format :** H.264 (High, niveau 3.1) et AAC, 1280×720, environ 60 secondes. Le fichier est optimisé pour démarrer vite en ligne (index placé en tête).
- **Sous-titres :** français, incrustés dans l’image. Il n’y a donc pas de fichier `.vtt`.
- **Lecture :** poster `assets/images/06_DECLIC_IA_ENDCARD.jpeg`, `preload="metadata"`, pas d’autoplay.
- **Remplacer la vidéo :** déposer le nouveau fichier sous le même nom, au même emplacement. Aucun autre changement n’est nécessaire.
- **Git LFS :** ne pas l’utiliser pour la vidéo, le fichier est versionné directement.

---

## Limites connues

- **Formulaire :** démonstration uniquement. Il ne transmet ni ne stocke aucune donnée et affiche un message de confirmation local.
- **Lecture de la vidéo sans codec H.264 :** les navigateurs qui ne lisent pas le H.264 affichent le message de repli prévu (« La vidéo n’est pas disponible pour le moment. »). C’est le cas, par exemple, de certaines versions open source de Chromium.
- **Favicon :** aucun pour le moment. Les navigateurs peuvent signaler une requête `favicon.ico` introuvable, sans incidence.
- **Suivi :** aucun outil de mesure d’audience ni service tiers.
- **Contenu :** le site est fictif et ne contient ni adresse, ni prix, ni témoignage, ni client.
- **Certifications :** les certifications citées sont des certifications **tierces** (Scrum.org, Scaled Agile). Déclic IA ne les délivre pas et n’est pas affilié à ces organismes.
