import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { DossierSearchApi } from './dossier-search-api';
import { DossierSearchRequest, PageDossierSinistre } from './dossier.model';

/**
 * Client HTTP réel pour l'opération `rechercherDossiersSinistre` du contrat
 * OpenAPI (`POST /prestations-prevoyance/dossier-sinistre/recherche`).
 *
 * Même interface publique que `DossierMockService` (`DossierSearchApi`) :
 * les deux services sont interchangeables. Le composant Pv22 choisit
 * l'implémentation à injecter selon `environment.useMock`.
 *
 * NB : le contrat ne définit pas de paramètre de tri pour cette route ;
 * `request.sortField` / `request.sortDirection` sont donc ignorés ici (ils
 * ne servent qu'au mock).
 */
@Injectable({ providedIn: 'root' })
export class DossierSinistreApiService extends DossierSearchApi {
  private readonly http = inject(HttpClient);

  search(request: DossierSearchRequest): Observable<PageDossierSinistre> {
    const params = new HttpParams()
      .set('page', request.page)
      .set('size', request.size);

    return this.http.post<PageDossierSinistre>(
      `${environment.apiUrl}/prestations-prevoyance/dossier-sinistre/recherche`,
      request.criteria,
      { params }
    );
  }
}
