/**
 * Modèles de données pour le tableau des dossiers assurés.
 */

export type Genre = 'M' | 'Mme';

/** Représente une ligne "brute" telle que renvoyée par le service. */
export interface DossierAssure {
  id: number;
  numeroDossier: string;
  numeroAssure: string;
  genre: Genre;
  nom: string;
  prenom: string;
  dateDebut: Date;
  dateFin: Date | null;
  dateCloture: Date | null;
}

/** Critères de recherche multi-critères envoyés au service. */
export interface DossierSearchCriteria {
  genericSearch?: string | null;
  dateDebutFrom?: Date | null;
  dateDebutTo?: Date | null;
  dateFinFrom?: Date | null;
  dateFinTo?: Date | null;
  dateClotureFrom?: Date | null;
  dateClotureTo?: Date | null;
}

/** Champs sur lesquels le tri serveur est possible. */
export type DossierSortField =
  | 'numeroDossier'
  | 'numeroAssure'
  | 'assure'
  | 'dateDebut'
  | 'dateFin'
  | 'dateCloture';

export interface DossierSearchRequest {
  criteria: DossierSearchCriteria;
  pageIndex: number; // 0-based
  pageSize: number;
  sortField?: DossierSortField | null;
  sortDirection?: 'asc' | 'desc' | '';
}

/** Résultat paginé renvoyé par le service. */
export interface DossierSearchResult {
  items: DossierAssure[];
  total: number;
}
