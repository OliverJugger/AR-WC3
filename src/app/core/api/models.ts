/**
 * Modèles TypeScript reflétant les schémas définis dans `openapi/openapi.yaml`.
 *
 * Ces interfaces sont écrites à la main pour que le projet compile et
 * fonctionne "out of the box". Elles sont volontairement alignées 1:1 avec
 * le contrat OpenAPI. Si vous préférez un client entièrement généré, lancez
 * `npm run generate:api` (voir `ng-openapi-gen.json`) : il régénérera un
 * client typé dans `core/api/generated/` à partir du même fichier yaml.
 */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CurrentUser {
  username: string;
  displayName: string;
  avatarInitials?: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: CurrentUser;
}

/** Un point de données pour un graphique de type "pie" (ngx-charts). */
export interface ChartDatum {
  name: string;
  value: number;
}

export interface StatisticsResponse {
  stat1: ChartDatum[];
  stat2: ChartDatum[];
  stat3: ChartDatum[];
  stat4: ChartDatum[];
}

export interface Pv22Response {
  stat1: ChartDatum[];
  stat2: ChartDatum[];
  stat3: ChartDatum[];
  stat4: ChartDatum[];
}

export interface ErrorResponse {
  message: string;
}
