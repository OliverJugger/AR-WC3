import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { AuthApi } from '../api/auth-api';
import { CurrentUser, LoginRequest } from '../api/models';

const TOKEN_STORAGE_KEY = 'ar-wc3.auth-token';
const USER_STORAGE_KEY = 'ar-wc3.current-user';

/**
 * Store d'authentification (état réactif basé sur les signals).
 *
 * Pour l'instant, `login()` s'appuie sur le mock (interceptor Angular ou
 * Mockoon) qui renvoie systématiquement un succès - voir
 * `core/interceptors/mock-api-interceptor.ts` et `mockoon/environment.json`.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authApi = inject(AuthApi);

  private readonly currentUserSignal = signal<CurrentUser | null>(this.readStoredUser());
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY));

  /** Utilisateur actuellement connecté (donnée mockée). */
  readonly currentUser = this.currentUserSignal.asReadonly();

  /** `true` si un utilisateur est connecté. */
  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);

  login(credentials: LoginRequest): Observable<boolean> {
    return this.authApi.login(credentials).pipe(
      tap((response) => {
        this.tokenSignal.set(response.token);
        this.currentUserSignal.set(response.user);
        localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      }),
      // La réponse mockée renvoie systématiquement `success: true`.
      map((response) => response.success)
    );
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  private readStoredUser(): CurrentUser | null {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CurrentUser) : null;
  }
}
