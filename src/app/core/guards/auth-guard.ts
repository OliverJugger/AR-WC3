import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '../services/auth-store';

/**
 * Protège les routes qui nécessitent un utilisateur connecté.
 * Redirige vers `/login` si ce n'est pas le cas.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/login');
};
