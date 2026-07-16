import { Route, Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { collectLeafRoutes, NAV_TREE } from './core/navigation/nav-tree';

/**
 * Routes générées automatiquement à partir des feuilles de `NAV_TREE`
 * (menu de navigation "explorateur de fichiers" de la sidebar).
 * Les 2 feuilles marquées `exampleId` pointent vers un composant dédié,
 * toutes les autres réutilisent le composant générique `PagePlaceholder`.
 */
const navTreeRoutes: Routes = collectLeafRoutes(NAV_TREE).map((leaf): Route => {
  if (leaf.exampleId === 1) {
    return {
      path: leaf.path,
      loadComponent: () => import('./pages/example-page-1/example-page-1').then((m) => m.ExamplePage1),
      title: leaf.title,
    };
  }

  if (leaf.exampleId === 2) {
    return {
      path: leaf.path,
      loadComponent: () => import('./pages/example-page-2/example-page-2').then((m) => m.ExamplePage2),
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
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./home/home').then((m) => m.Home),
        title: 'Accueil',
      },
      ...navTreeRoutes,
    ],
  },
  { path: '**', redirectTo: 'login' },
];
