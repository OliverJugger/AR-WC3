import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from './models';

/**
 * Client HTTP pour les opérations `auth` du contrat OpenAPI
 * (opération `login`, chemin `POST /login`).
 */
@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly http = inject(HttpClient);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/login', request);
  }
}
