import { Observable } from 'rxjs';
import { DossierSearchRequest, PageDossierSinistre } from './dossier.model';

/**
 * Contrat commun implémenté par `DossierMockService` (données en mémoire)
 * et `DossierSinistreApiService` (vrai back-end). Le composant Pv22 dépend
 * de cette classe abstraite plutôt que d'une implémentation concrète, ce qui
 * permet de basculer de l'une à l'autre via `environment.useMock`.
 */
export abstract class DossierSearchApi {
  abstract search(request: DossierSearchRequest): Observable<PageDossierSinistre>;
}
