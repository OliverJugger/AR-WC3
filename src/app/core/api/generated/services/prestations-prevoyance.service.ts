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

import { Pv22Response } from '../models/pv-22-response';


/**
 * Prestations prevoyance
 */
@Injectable({ providedIn: 'root' })
export class PrestationsPrevoyanceService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getPv22()` */
  static readonly GetPv22Path = '/prestations-prevoyance/pv22';

  /**
   * Récupère les sinistres.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPv22()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPv22$Response(
    params?: {
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<Pv22Response>> {
    const rb = new RequestBuilder(this.rootUrl, PrestationsPrevoyanceService.GetPv22Path, 'get');
    if (params) {
    }

    return this.http.request(
      rb.build({ responseType: 'json', accept: 'application/json', context })
    ).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Pv22Response>;
      })
    );
  }

  /**
   * Récupère les sinistres.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getPv22$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPv22(
    params?: {
    },
    context?: HttpContext
  ): Observable<Pv22Response> {
    return this.getPv22$Response(params, context).pipe(
      map((r: StrictHttpResponse<Pv22Response>): Pv22Response => r.body)
    );
  }

}
