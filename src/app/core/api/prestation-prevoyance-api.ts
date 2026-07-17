import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Pv22Response } from './models';

/**
 * Client HTTP pour les opérations `prestation-prevoyance` du contrat OpenAPI
 * (opération `getPv22`, chemin `GET /prestation-prevoyance/pv22`).
 */
@Injectable({ providedIn: 'root' })
export class PrestationPrevoyanceApi {
  private readonly http = inject(HttpClient);

  getPv22(): Observable<Pv22Response> {
    return this.http.get<Pv22Response>(`${environment.apiUrl}/prestation-prevoyance/pv22`);
  }
}
