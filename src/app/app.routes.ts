import { Route, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { collectLeafRoutes, NAV_TREE } from './core/navigation/nav-tree';

/**
 * Routes générées automatiquement à partir des feuilles de `NAV_TREE`
 * (menu de navigation "explorateur de fichiers" de la sidebar).
 * Chaque page avec son code arthus pointe vers un composant dédié,
 * les pas encore créées réutilisent le composant générique `PagePlaceholder`.
 */
const navTreeRoutes: Routes = collectLeafRoutes(NAV_TREE)
  .map((leaf): Route => {
    if (leaf.code_arthus === 'PV22') {
      return {
          path: leaf.path,
          loadComponent: () => import('./pages/prestationsprevoyance/pv22/pv22').then((m) => m.Pv22),
          title: leaf.title,
      };
    }

    if (leaf.code_arthus === 'PV10B') {
      return {
          path: leaf.path,
          loadComponent: () => import('./pages/prestationsprevoyance/pv10b/pv10b').then((m) => m.Pv10b),
          title: leaf.title,
      };
    }

    return {
      path: leaf.path,
      loadComponent: () =>
        import('./shared/page-placeholder/page-placeholder').then((m) => m.PagePlaceholder),
      title: leaf.title,
      data: { title: leaf.title },
    };
});

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
    title: 'Connexion',
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout').then((m) => m.MainLayout),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'menu', pathMatch: 'full' },
      {
        path: 'menu',
        loadComponent: () => import('./home/home').then((m) => m.Home),
        title: 'Accueil',
      },
      ...navTreeRoutes,
    ],
  },
  { path: '**', redirectTo: 'login' },
];
