# Composant `app-dossier-table`

Composant standalone Angular Material : tableau de dossiers assurés avec recherche
multi-critères et pagination, alimenté par un service fictif à données locales.

## Fichiers

- `dossier.model.ts` — interfaces (`DossierAssure`, critères de recherche, requête/résultat paginé)
- `dossier-mock.service.ts` — service fictif : génère ~137 dossiers en mémoire, applique filtres/tri/pagination avec une latence simulée de 350 ms
- `dossier-table.component.ts` / `.html` / `.scss` — le composant

## Intégration

1. Copier les 5 fichiers dans un dossier de votre projet, par ex. `src/app/dossiers/`.
2. Le composant est **standalone** : importez-le directement où vous en avez besoin.

```ts
import { DossierTableComponent } from './dossiers/dossier-table.component';

@Component({
  standalone: true,
  imports: [DossierTableComponent],
  template: `<app-dossier-table />`,
})
export class MaPageComponent {}
```

3. Prérequis d'application (à faire une seule fois, pas dans le composant) :
   - Animations Material : `provideAnimationsAsync()` (ou `provideAnimations()`) dans `app.config.ts`.
   - Format des dates en français dans les `mat-datepicker` : ajoutez
     `{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }` aux providers de `app.config.ts`
     (le composant utilise déjà `MatNativeDateModule` ; vous pouvez remplacer par un
     adapter Luxon/date-fns si c'est déjà votre standard sur le projet).
   - Locale Angular pour le `DatePipe` si vous affichez d'autres formats localisés
     ailleurs : `registerLocaleData(localeFr)` + `LOCALE_ID: 'fr'`.

## Remplacer le service fictif par le vrai back-end

`DossierMockService` expose une seule méthode :

```ts
search(request: DossierSearchRequest): Observable<DossierSearchResult>
```

Pour brancher l'API réelle, créez un service `DossierService` (HttpClient) qui respecte
la même signature et injectez-le à la place de `DossierMockService` dans le composant
(ou utilisez un `InjectionToken`/interface commune si vous voulez garder les deux
implémentations disponibles, par ex. pour des tests ou du mode démo).

## Points fonctionnels

- Recherche : N° Dossier, N° Assuré et Assuré (recherche libre sur "Genre + Nom + Prénom")
  sont toujours visibles. Un bouton "Filtres avancés" révèle des plages de dates
  (du/au) pour Date de début, Date de fin et Date de clôture.
- "Rechercher" relance la requête et revient à la page 1. "Réinitialiser" vide le formulaire.
- Tri serveur simulé sur toutes les colonnes (cliquer sur les en-têtes).
- Pagination via `mat-paginator` (10 / 25 / 50 / 100 lignes par page).
- Les colonnes de dates affichent `dd/MM/yyyy` et un tiret (`—`) quand la date est absente
  (dossier non clôturé, etc.).
