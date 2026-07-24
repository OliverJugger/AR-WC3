import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { StatisticsResponse } from './models';

/**
 * Client HTTP pour les opérations `statistics` du contrat OpenAPI
 * (opération `getStatistics`, chemin `GET /statistics`).
 */
@Injectable({ providedIn: 'root' })
export class StatisticsApi {
  private readonly http = inject(HttpClient);

  getStatistics(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>('/statistics');
  }
}