# Bilan de Réalisation - Application Voyages

Ce document récapitule l'ensemble des modules techniques, des fonctionnalités et des choix d'architecture que j'ai implémentés avec succès sur l'application frontend **Voyages**. 

---

## 1. Architecture Globale (Redux Toolkit)

J'ai fait le choix structurant de centraliser la logique métier et les états asynchrones de l'application au sein d'un **Store Redux global**, plutôt que de surcharger les composants ou de me reposer sur un stockage passif comme le `localStorage`.

* L'application est découpée en **Slices** autonomes (`auth`, `users`, `destinations`, `comments`, `search`, `favorites`, `theme`). Tout changement d'état déclenché par une action (un `dispatch`) est immédiatement répercuté de manière réactive sur l'ensemble des vues connectées (Navbar, cartes, listes).
* **Gestion Asynchrone Normalisée :** Chaque interaction avec l'API REST s'appuie sur `createAsyncThunk`. Les requêtes suivent un cycle de vie standardisé à travers 4 statuts bien définis dans mon application :
    * `waiting` : État initial ou de repos.
    * `pending` : Requête en cours (déclenchement des Spinners de chargement).
    * `success` : Requête réussie (mise à jour des données et alertes positives).
    * `error` : Capture propre des messages d'erreur renvoyés par l'API pour affichage utilisateur.
* **Sécurisation Transversale :** Utilisation d'un client HTTP fetch centralisé (`apiRequest`). Il injecte automatiquement le jeton d'authentification JWT (Bearer Token) récupéré du Store Redux dans les en-têtes de chaque requête nécessitant une barrière de sécurité.

---

## 2. Liste des Fonctionnalités Implémentées par Module

### Authentification & Persistance (`authSlice.js`)
* **Inscription & Connexion :** Connexion complète de l'interface aux endpoints sécurisés `/auth/register.php` et `/auth/login.php`.
* **Persistance :** Sauvegarde du token et de l'objet utilisateur initial dans le `localStorage` uniquement pour maintenir la session active au rafraîchissement de la page (`F5`), transférant immédiatement la main à Redux à l'initialisation.
* **Déconnexion Sécurisée (`logout`) :** Action combinée qui purge instantanément le Store Redux et nettoie le `localStorage`, garantissant qu'aucune donnée résiduelle ne reste accessible en mémoire.

### Profil Voyageur & Sécurité Active (`usersSlice.js`)
* **Mise à jour d'Informations (Formulaire) :** Édition complète des données de compte (Prénom, Nom, Pseudo, Genre, avatar). Gestion des champs via `React-Hook-Form` et validation des types via `Yup`.
* **Modification du Mot de Passe (Formulaire) :** Implémentation d'un tunnel sécurisé de modification de mot de passe (Mot de passe actuel / Nouveau mot de passe / Confirmation). Validation par expressions régulières (Regex) strictes exigeant un minimum de 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.
* **Synchronisation en Temps Réel :** Création d'un reducer spécifique `updateLocalUser` dans le slice d'authentification pour mettre à jour instantanément les informations en mémoire (et la Navbar) dès le succès de la requête de modification, sans nécessiter de reconnexion.
* **Historique des Avis (Carousel) :** Création d'un composant dédié `<UserComments />` interrogeant l'API sécurisée pour afficher dynamiquement les anciens commentaires de l'utilisateur sur son profil, formatés dans un carrousel Bootstrap interactif.

### Destinations & Détail Destination (`destinationSlice.js`)
* **Mapping Dynamique :** Consommation fluide de l'API (`/destinations/index.php`).
* **Rendu par Slug Unique :** Page de détails dynamique (`DestinationDetailPage.jsx`) exploitant `useParams` pour interroger l'API via un slug unique (`/destinations/show.php?slug=...`).
* **Géolocalisation Interactive :** Intégration adaptative d'une carte iframe Google Maps. Elle consomme dynamiquement les coordonnées de latitude et de longitude fournies par le backend pour chaque destination, encapsulée dans un conteneur.

### Commentaires & Avis Voyageurs (`commentSlice.js`)
* **Composant Réutilisable :** Conception d'un module indépendant `<CommentsSection />` injecté en bas de la fiche destination pour dissocier la logique des commentaires de la vue principale.
* **Formulaire de Notation Interactif :** Système d'étoiles réactif en JS (gestion du clic de sélection et animation au survol) associé à une zone de texte soumise à une validation `Yup` (10 caractères minimum).
* **Carousel Dynamique :** Mise en page affichant les avis sous forme de **Carousel Bootstrap** disposé côte à côte avec la carte géographique (Grille `Row`/`Col` optimisée).
* **Fiche d'identité :** Utilisation du mapping des clés d'API (`username`, `avatar`) pour afficher l'identité et la photo réelles des auteurs des avis.

### Moteur de Recherche (`searchSlice.js`)
* **Filtrage Multicritères Backend :** Formulaire de recherche interrogeant directement le serveur via `/destinations/search.php`, nettoyant à la volée les paramètres vides.
* **Alimentation Dynamique des Filtres :** Consommation de l'API des régions (`/regions/index.php`) pour générer dynamiquement les options du menu déroulant et mapper la recherche sur le `slug` de région attendu par le backend.
* **Synchronisation avec l'URL (Deep Linking) :** Utilisation de `useSearchParams` pour lier les critères à la barre d'adresse de l'internaute, rendant les résultats de recherche mémorisables et partageables.
* **Réinitialisation Propre :** Action `clearSearchResults` pour vider instantanément les résultats du Store et réinitialiser le formulaire.

### Gestion des Favoris (`favoriteSlice.js`)
* **Expérience Utilisateur Conditionnelle (UX) :** Optimisation du composant `<FavoriteButton />` pour qu'il s'efface complètement (`return null`) si aucun utilisateur n'est connecté, évitant les clics pour les simples visiteurs.
* **Espace "Mes Favoris" :** Création d'un tableau de bord utilisateur (`FavoritesPage.jsx`) listant l'intégralité des destinations sauvegardées par l'utilisateur connecté via l'endpoint `/favorites/index.php`.
* **Création du slice :** Création du thunk de suppression, d'ajout et de listing des favoris avec la correction des formats d'objets (camelCase) exigés par le backend PHP.

### Thème & Accessibilité (`themeSlice.js`)
* **Mode Sombre / Clair :** Implémentation d'un système de bascule globale (Dark Mode) via un bouton interactif dans la Navbar.
* **Écouteur de Thème :** Le `MainLayout` est connecté au store Redux pour modifier dynamiquement l'attribut `data-bs-theme` du document HTML.
* **Persistance :** Sauvegarde du choix utilisateur dans le `localStorage`.

---

## 3. Stack Technique pour le Projet

* **Framework Principal :** React (Hooks, Context, Router)
* **Gestion d'État :** Redux Toolkit (`configureStore`, `createSlice`, `createAsyncThunk`, `useSelector`, `useDispatch`)
* **Architecture Graphique :** React-Bootstrap & Bootstrap 5 (Grilles fluides, Carousels, Spinners, Badges, Alertes, utilitaires de positionnement natifs au Dark Mode)
* **Formulaires & Validation :** React-Hook-Form & Yup (via `yupResolver`)
