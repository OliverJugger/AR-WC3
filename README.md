# AR-WC3

Application Angular 21 + Angular Material, avec authentification mockée,
communication API pilotée par un contrat OpenAPI (`openapi/openapi.yaml`), et
mock de backend via **Mockoon** (ou un interceptor Angular in-memory,
utilisable sans rien installer).

## Stack

- **Angular 21** (standalone, zoneless, nouveau style guide sans suffixe `.component`)
- **Angular Material** (thème Material 3)
- **@swimlane/ngx-charts** pour les graphiques `pie`
- **ng-openapi-gen** pour générer un client HTTP typé à partir de `openapi/openapi.yaml`
- **Mockoon** pour simuler l'API sans backend

## Installation

```bash
npm install
```

## Lancer l'application (mode mocké, sans backend)

Par défaut (`src/environments/environment.ts` → `useMock: true`), un
interceptor Angular simule les réponses de `/login` et `/statistics` :
aucune autre étape n'est nécessaire.

```bash
npm start
```

## Avec backend :

Modifier environment.ts :
useMock: false,
apiUrl: 'http://localhost:8080',

```bash
ng serve --proxy-config proxy.conf.json 
```

Puis ouvrez http://localhost:4200. Le formulaire de connexion accepte
n'importe quel couple identifiant/mot de passe non vide (validation "requis"
uniquement) et redirige systématiquement vers `/home`.

## Lancer l'application avec Mockoon (au lieu du mock in-memory)

1. Installez [Mockoon Desktop](https://mockoon.com/download/).
2. Ouvrez `mockoon/environment.json` dans Mockoon (`File > Open environment`).
3. Démarrez l'environnement (il écoute sur `http://localhost:3001`).
4. Dans `src/environments/environment.ts`, passez `useMock` à `false`.
5. Relancez `npm start`.

Les deux routes mockées (`POST /login`, `GET /statistics`) suivent le
contrat défini dans `openapi/openapi.yaml`.

## Contrat OpenAPI et génération du client HTTP

Le contrat vit dans `openapi/openapi.yaml`. Le projet embarque deux clients
typés alignés sur ce contrat :

- `src/app/core/api/auth-api.ts` et `statistics-api.ts` : écrits à la main,
  fonctionnent immédiatement (utilisés par défaut dans l'application).
- `src/app/core/api/generated/` : cible de la génération automatique via
  [ng-openapi-gen](https://github.com/cyclosproject/ng-openapi-gen).

Pour régénérer un client à partir du contrat :

```bash
npm run generate:api
```

## Structure du projet

```
openapi/openapi.yaml        Contrat OpenAPI (source de vérité de l'API)
mockoon/environment.json    Environnement Mockoon (routes /login, /statistics)
public/logo.png             Logo affiché dans le header (à remplacer par le vrai logo)
src/environments/           Configuration (apiUrl, useMock)
src/app/core/                Services transverses (API, auth, guard, interceptor)
src/app/login/               Page de connexion
src/app/layout/              Header + Sidebar (affichés sur toutes les pages sauf /login)
src/app/home/                Tableau de bord (4 graphiques pie alimentés par /statistics)
```

## Remplacer le logo

`public/logo.png` est un logo de substitution généré automatiquement.
Remplacez-le simplement par votre propre fichier `logo.png` (même nom, même
emplacement) pour qu'il apparaisse dans le header.

## Prochaines étapes suggérées

- Remplacer le mock `/login` par un vrai appel backend (les validateurs de
  formulaire et la structure sont déjà en place).
- Ajouter d'autres entrées dans `src/app/layout/sidebar/sidebar.ts`
  (tableau `navItems`) au fur et à mesure des nouvelles pages.
- Committer ou non `src/app/core/api/generated/` selon que vous préférez
  générer le client à l'installation (`postinstall`) ou le versionner.
