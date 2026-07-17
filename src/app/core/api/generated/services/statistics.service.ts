/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';

import { StatisticsResponse } from '../models/statistics-response';


/**
 * Statistiques du tableau de bord
 */
@Injectable({ providedIn: 'root' })
export class StatisticsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getStatistics()` */
  static readonly GetStatisticsPath = '/statistics';

  /**
   * Récupère les statistiques utilisées par les 4 graphiques du tableau de bord.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getStatistics()` instead.
   *
   * This method doesn't expect any request body.
   */
  getStatistics$Response(
    params?: {
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<StatisticsResponse>> {
    const rb = new RequestBuilder(this.rootUrl, StatisticsService.GetStatisticsPath, 'get');
    if (params) {
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<StatisticsResponse>;
      })
    );
  }

  /**
   * Récupère les statistiques utilisées par les 4 graphiques du tableau de bord.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getStatistics$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getStatistics(
    params?: {
    },
    context?: HttpContext
  ): Observable<StatisticsResponse> {
    return this.getStatistics$Response(params, context).pipe(
      map((r: StrictHttpResponse<StatisticsResponse>): StatisticsResponse => r.body)
    );
  }

}
