/**
 * Modèles de données pour le tableau des dossiers sinistre.
 *
 * Alignés sur le contrat OpenAPI (`ar-api/.../openapi.yaml`) : opération
 * `rechercherDossiersSinistre` (`POST /prestations-prevoyance/dossier-sinistre/recherche`),
 * schémas `DossierSinistreCriteria`, `DossierSinistre`, `Individu`, `PageDossierSinistre`.
 */

export type Genre = 'M' | 'Mme' | '';

/**
 * Sous-ensemble du schéma `Individu` du contrat effectivement utilisé par
 * l'affichage (le schéma complet compte une cinquantaine de champs base de
 * données).
 */
export interface DossierIndividu {
  numindiv: number;
  nom?: string;
  prenom?: string;
  /** Convention INSEE : 1 = masculin, 2 = féminin. */
  sexe?: number;
  numassu?: number;
}

/** Reflète le schéma `DossierSinistre` du contrat. */
export interface DossierSinistre {
  idDossier: string;
  refExt?: string | null;
  individu?: DossierIndividu;
  /** 'O' | 'N' */
  anterieur?: string | null;
  /** date-time ISO */
  debut?: string | null;
  fin?: string | null;
  cloture?: string | null;
}

/** Reflète le schéma `DossierSinistreCriteria` du contrat. */
export interface DossierSinistreCriteria {
  anterieur?: boolean;
  finNull?: boolean;
  prenomIndividuContains?: string;
  nomIndividuContains?: string;
  /** date (yyyy-MM-dd) */
  debutFrom?: string;
  debutTo?: string;
  finFrom?: string;
  finTo?: string;
}

/**
 * Requête envoyée au service de recherche. `page` est 0-based, comme défini
 * par le contrat (paramètres de requête `page` et `size` de la route).
 */
export interface DossierSearchRequest {
  criteria: DossierSinistreCriteria;
  page: number;
  size: number;
  /**
   * Le contrat ne définit pas de tri serveur pour cette route : ce champ
   * n'est utilisé que par le mock (tri sur l'ensemble du jeu de données).
   * Le service réel l'ignore.
   */
  sortField?: DossierSortField | null;
  sortDirection?: 'asc' | 'desc' | '';
}

/**
 * Champs sur lesquels le tri (mock uniquement) est possible. Les valeurs
 * correspondent aux `matColumnDef` du tableau (`mat-sort-header` dérive son
 * id du nom de colonne).
 */
export type DossierSortField =
  | 'numeroDossier'
  | 'numeroAssure'
  | 'assure'
  | 'dateDebut'
  | 'dateFin'
  | 'dateCloture';

/** Reflète le schéma `PageDossierSinistre` du contrat. */
export interface PageDossierSinistre {
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
  data: DossierSinistre[];
}
