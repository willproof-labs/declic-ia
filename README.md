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
│   ├── images/                Les six illustrations fournies + image de partage
│   └── video/declic-ia.mp4    Vidéo locale
├── .github/workflows/deploy-pages.yml
├── docs/
│   ├── architecture.md        Architecture et contrats entre fichiers
│   └── qa-checklist.md        Liste de contrôle qualité
├── .nojekyll
├── .gitignore
├── LICENSE                    MIT pour le code uniquement (voir « Licence »)
└── README.md
```

Tous les chemins du site sont **relatifs** (`css/…`, `js/…`, `assets/…`). Le site fonctionne à la racine d’un domaine comme sous un sous-chemin (par exemple `https://<compte>.github.io/<depot>/`).

**Une seule exception :** les balises Open Graph `og:url` et `og:image` (voir « Aperçu de partage ») contiennent l’adresse absolue du site publié, car la norme l’exige. Aucune autre adresse n’est écrite en dur.

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

## Aperçu de partage (Open Graph)

Quand le lien du site est partagé (LinkedIn, messageries…), l’aperçu est construit à partir des balises Open Graph du `<head>` de `index.html` :

- **Titre :** « Déclic IA — projet de portfolio réalisé avec l’IA ».
- **Description :** « Site vitrine d’un organisme de formation fictif : méthode et décisions humaines, code par Claude Code, publicité vidéo générée avec Higgsfield. »
- **Image :** `assets/images/og-declic-ia.jpg`, 1200 × 627 px, environ 105 Ko. C’est un montage des illustrations `01` (avant) et `05` (après), reprises sans régénération (recadrage et mise à l’échelle uniquement). Le logo y est composé en texte avec les couleurs exactes du site.
- **Adresse absolue :** `og:url` et `og:image` pointent vers `https://willproof-labs.github.io/declic-ia/`. Si le site change d’adresse (autre compte, domaine personnalisé, Cloudflare Pages seul), il faut mettre à jour ces deux balises.

Après publication, coller l’adresse du site dans le **LinkedIn Post Inspector** pour vérifier l’aperçu et forcer LinkedIn à relire la page, car il garde les aperçus en cache.

---

## Versions

- **`assessment-v1`** : tag de la version rendue au jury de l’assessment le 20 octobre 2026, avant l’ajout de l’aperçu de partage. Pour la consulter ou la restaurer : `git checkout assessment-v1`.

---

## Démarche et crédits

Ce site est un **projet de portfolio**. Il démontre qu’on peut concevoir et livrer un site fonctionnel et pertinent avec l’IA générative, sous pilotage humain. Il a été réalisé pour l’exercice 2 d’un assessment, du 16 au 20 octobre 2026. « Déclic IA » est un nom fictif : d’autres sites portant un nom proche n’ont aucun lien avec ce projet.

### Qui a fait quoi

| Contribution | Réalisée par |
|---|---|
| Méthode, cadrage, brief du site, décisions, validations lot par lot, contrôle qualité humain | Wilson FRED |
| Images de travail, scripts et storytelling de la publicité | Duck.ai (modèle GPT-6 Luna), sous la direction de Wilson FRED |
| Publicité vidéo | Générée avec Higgsfield ; montage, sous-titres et contrôle qualité pilotés par Wilson FRED |
| Code du site (HTML, CSS, JavaScript), tests automatisés, documentation, workflow de déploiement | Claude (Claude Code), à partir du brief et des validations de Wilson FRED |
| Image de partage | Montage des illustrations 01 et 05, sans régénération |

Le site a été construit en lots validés un par un (fondations, composants, JavaScript, déploiement, contrôle qualité final). Chaque lot correspond à un commit de l’historique.

### Sources méthodologiques

- Expérience terrain de Product Owner / Program Manager.
- [Professional Scrum Product Owner™ I (PSPO I)](https://www.credly.com/badges/e8f3410b-8a97-4030-b1a0-5ef19bbd1fc2), Scrum.org — délivré le 19 juillet 2024.
- [Certified SAFe® 6 Agilist](https://www.credly.com/badges/bdc7e56a-fca2-4c63-8fbb-5653e8b621d5), Scaled Agile — certifié en 2024.
- [Certified AI-Native SAFe® Agilist](https://www.credly.com/badges/2ffeda5c-16de-4abf-b06e-c6d0395880c4), Scaled Agile — certifié à l’été 2026.
- [Generative AI Leader Certification](https://www.credly.com/badges/8f59ae7b-e153-4620-8e29-9a2b40451e90), Google Cloud — certifié en octobre 2026.
- [Open Source Software Development Methods](https://www.coursera.org/account/accomplishments/certificate/DWXAVMFC24S9), The Linux Foundation (Coursera) — certifié en 2023.
- [Google Project Management Professional Certificate](https://www.coursera.org/professional-certificates/google-project-management) (Coursera) — en cours : cours validés, Capstone en cours.

Badges vérifiables sur le [profil Credly de Wilson FRED](https://www.credly.com/users/wilson-fred/badges/credly).

---

## Licence

Ce dépôt est sous **double régime** :

| Élément | Régime |
|---|---|
| **Code** : balisage de `index.html`, `css/`, `js/`, `.github/workflows/`, `README.md`, `docs/` | **Licence MIT**, voir [`LICENSE`](LICENSE). Réutilisation libre avec mention du copyright. Fourni « en l’état », sans garantie. |
| **Contenus** : `assets/images/`, `assets/video/`, textes rédactionnels affichés par le site, nom et identité visuelle « Déclic IA » | **Tous droits réservés**, © 2026 Wilson FRED. Toute réutilisation nécessite une autorisation écrite. |

**Pourquoi les contenus ne sont pas sous licence libre.** Les illustrations et la publicité vidéo ont été générées avec Duck.ai et Higgsfield. Leurs conditions d’utilisation laissent les contenus générés à l’utilisateur, mais en encadrent la réutilisation : Higgsfield interdit notamment d’utiliser ses sorties pour entraîner des modèles d’IA. Une licence libre accorderait à des tiers des droits que l’auteur ne détient pas lui-même.

**Marques citées.** Scrum.org, Professional Scrum Product Owner, PSPO, SAFe et Scaled Agile sont des marques de leurs détenteurs respectifs. Elles sont citées à titre informatif, sans affiliation.

---

## Limites connues

- **Formulaire :** démonstration uniquement. Il ne transmet ni ne stocke aucune donnée et affiche un message de confirmation local.
- **Lecture de la vidéo sans codec H.264 :** les navigateurs qui ne lisent pas le H.264 affichent le message de repli prévu (« La vidéo n’est pas disponible pour le moment. »). C’est le cas, par exemple, de certaines versions open source de Chromium.
- **Favicon :** aucun pour le moment. Les navigateurs peuvent signaler une requête `favicon.ico` introuvable, sans incidence.
- **Suivi :** aucun outil de mesure d’audience ni service tiers.
- **Contenu :** le site est fictif et ne contient ni adresse, ni prix, ni témoignage, ni client.
- **Certifications :** les certifications citées sont des certifications **tierces** (Scrum.org, Scaled Agile). Déclic IA ne les délivre pas et n’est pas affilié à ces organismes.
