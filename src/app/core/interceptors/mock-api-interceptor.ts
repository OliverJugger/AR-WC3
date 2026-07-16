import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ChartDatum, LoginResponse, StatisticsResponse } from '../api/models';

/**
 * Interceptor de mock "in-memory".
 *
 * Quand `environment.useMock` vaut `true`, cet interceptor court-circuite
 * les appels vers `/login` et `/statistics` et renvoie des données
 * inventées, sans qu'un serveur (Mockoon ou autre) ait besoin de tourner.
 *
 * Pour utiliser Mockoon Desktop à la place (`mockoon/environment.json`),
 * passez `useMock` à `false` dans `src/environments/environment.ts` et
 * démarrez l'environnement Mockoon sur le port 3001.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMock) {
    return next(req);
  }

  if (req.method === 'POST' && req.url.endsWith('/login')) {
    return of(new HttpResponse<LoginResponse>({ status: 200, body: mockLoginResponse() })).pipe(
      delay(MOCK_DELAY_MS)
    );
  }

  if (req.method === 'GET' && req.url.endsWith('/statistics')) {
    return of(
      new HttpResponse<StatisticsResponse>({ status: 200, body: mockStatisticsResponse() })
    ).pipe(delay(MOCK_DELAY_MS));
  }

  return next(req);
};

const MOCK_DELAY_MS = 400;

function mockLoginResponse(): LoginResponse {
  return {
    success: true,
    token: 'mock-jwt-token',
    user: {
      username: 'olivier.mignot83',
      displayName: 'Olivier Mignot',
      avatarInitials: 'OM',
    },
  };
}

function mockStatisticsResponse(): StatisticsResponse {
  return {
    stat1: chartData('Ventes par région', [
      ['Nord', 32],
      ['Sud', 21],
      ['Est', 18],
      ['Ouest', 29],
    ]),
    stat2: chartData('Répartition par produit', [
      ['Produit A', 40],
      ['Produit B', 25],
      ['Produit C', 15],
      ['Produit D', 20],
    ]),
    stat3: chartData('Canaux de vente', [
      ['Web', 55],
      ['Mobile', 30],
      ['Boutique', 15],
    ]),
    stat4: chartData('Statut des commandes', [
      ['Livrées', 60],
      ['En cours', 25],
      ['Annulées', 8],
      ['Retournées', 7],
    ]),
  };
}

function chartData(_label: string, entries: [string, number][]): ChartDatum[] {
  return entries.map(([name, value]) => ({ name, value }));
}
