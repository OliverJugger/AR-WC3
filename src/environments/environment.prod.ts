/**
 * Environnement de production.
 *
 * Remplacez `apiUrl` par l'URL de la véritable API respectant le contrat
 * `openapi/openapi.yaml`, puis passez `useMock` à `false` pour désactiver le
 * mock in-memory.
 */
export const environment = {
  production: true,
  envName: 'PROD',
  useMock: false,
  apiUrl: 'https://api.example.com',
};
