/**
 * Environnement de développement.
 *
 * `useMock: true` active l'interceptor Angular qui simule les réponses de
 * l'API (voir `core/interceptors/mock-api-interceptor.ts`), ce qui permet de
 * lancer l'application sans backend.
 *
 * `apiUrl` pointe vers le port par défaut du serveur Mockoon
 * (`mockoon/environment.json`) si vous préférez passer par Mockoon plutôt
 * que par le mock in-memory (mettez alors `useMock` à `false`).
 */
export const environment = {
  production: false,
  useMock: true,
  apiUrl: 'http://localhost:3001',
};
