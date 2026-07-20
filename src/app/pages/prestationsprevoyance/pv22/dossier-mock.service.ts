import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  DossierAssure,
  DossierSearchCriteria,
  DossierSearchRequest,
  DossierSearchResult,
  Genre,
} from './dossier.model';

/**
 * Service FICTIF simulant un back-end.
 * - Génère un jeu de données brutes en mémoire au démarrage.
 * - Applique la recherche multi-critères et la pagination côté "serveur" simulé.
 * - Le composant appelant n'a aucune connaissance du stockage : il envoie une
 *   requête (critères + pagination + tri) et reçoit un résultat paginé.
 *
 * À remplacer par un vrai service HttpClient pointant vers l'API réelle
 * (même interface publique : search(request) => Observable<DossierSearchResult>).
 */
@Injectable({ providedIn: 'root' })
export class DossierMockService {
  /** Latence artificielle pour simuler un appel réseau (ms). */
  private static readonly SIMULATED_LATENCY = 350;

  private readonly dossiers: DossierAssure[] = this.generateMockData(137);

  search(request: DossierSearchRequest): Observable<DossierSearchResult> {
    const filtered = this.applyFilters(this.dossiers, request.criteria);
    const sorted = this.applySort(
      filtered,
      request.sortField ?? null,
      request.sortDirection ?? ''
    );

    const start = request.pageIndex * request.pageSize;
    const end = start + request.pageSize;

    const result: DossierSearchResult = {
      items: sorted.slice(start, end),
      total: sorted.length,
    };

    return of(result).pipe(
      delay(DossierMockService.SIMULATED_LATENCY),
      map((r) => r)
    );
  }

  // ---------------------------------------------------------------------
  // Filtrage
  // ---------------------------------------------------------------------

  private applyFilters(
    data: DossierAssure[],
    criteria: DossierSearchCriteria
  ): DossierAssure[] {
    return data.filter((d) => {
      if(!criteria.genericSearch)
        return true;
      return criteria.genericSearch &&
        (this.contains(d.numeroDossier, criteria.genericSearch)
        || this.contains(d.numeroAssure, criteria.genericSearch)
        || this.contains(`${d.genre} ${d.nom} ${d.prenom}`, criteria.genericSearch)
        || this.contains(d.numeroAssure, criteria.genericSearch)
        || this.contains(d.numeroAssure, criteria.genericSearch)
      );
    });
  }

  private contains(value: string, search: string): boolean {
    return value.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase());
  }

  private inRange(value: Date | null, from?: Date | null, to?: Date | null): boolean {
    if (!from && !to) {
      return true;
    }
    if (!value) {
      // Une ligne sans date (ex: dossier non clôturé) ne matche pas un filtre de plage.
      return false;
    }
    const time = this.stripTime(value).getTime();
    if (from && time < this.stripTime(from).getTime()) {
      return false;
    }
    if (to && time > this.stripTime(to).getTime()) {
      return false;
    }
    return true;
  }

  private stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  // ---------------------------------------------------------------------
  // Tri
  // ---------------------------------------------------------------------

  private applySort(
    data: DossierAssure[],
    field: DossierSearchRequest['sortField'],
    direction: 'asc' | 'desc' | ''
  ): DossierAssure[] {
    if (!field || !direction) {
      return data;
    }
    const factor = direction === 'asc' ? 1 : -1;
    const getValue = (d: DossierAssure): string | number => {
      switch (field) {
        case 'numeroDossier':
          return d.numeroDossier;
        case 'numeroAssure':
          return d.numeroAssure;
        case 'assure':
          return `${d.nom} ${d.prenom}`;
        case 'dateDebut':
          return d.dateDebut?.getTime() ?? 0;
        case 'dateFin':
          return d.dateFin?.getTime() ?? 0;
        case 'dateCloture':
          return d.dateCloture?.getTime() ?? 0;
        default:
          return '';
      }
    };
    return [...data].sort((a, b) => {
      const va = getValue(a);
      const vb = getValue(b);
      if (va < vb) return -1 * factor;
      if (va > vb) return 1 * factor;
      return 0;
    });
  }

  // ---------------------------------------------------------------------
  // Génération de données fictives
  // ---------------------------------------------------------------------

  private generateMockData(count: number): DossierAssure[] {
    const noms = [
      'MARTIN', 'BERNARD', 'THOMAS', 'ROBERT', 'PETIT', 'DURAND', 'LEROY',
      'MOREAU', 'SIMON', 'LAURENT', 'LEFEBVRE', 'MICHEL', 'GARCIA', 'DAVID',
      'BERTRAND', 'ROUX', 'VINCENT', 'FONTAINE', 'CHEVALIER', 'GAUTHIER',
    ];
    const prenomsH = ['Jean', 'Pierre', 'Michel', 'Alain', 'Philippe', 'Nicolas', 'Olivier', 'Marc'];
    const prenomsF = ['Marie', 'Sophie', 'Isabelle', 'Nathalie', 'Catherine', 'Julie', 'Claire', 'Sandrine'];

    const result: DossierAssure[] = [];
    const baseDate = new Date(2019, 0, 1).getTime();
    const spanMs = 1000 * 60 * 60 * 24 * 365 * 6; // ~6 ans d'étalement

    for (let i = 0; i < count; i++) {
      const genre: Genre = i % 2 === 0 ? 'M' : 'Mme';
      const nom = noms[i % noms.length];
      const prenom = genre === 'M' ? prenomsH[i % prenomsH.length] : prenomsF[i % prenomsF.length];

      const dateDebut = new Date(baseDate + Math.random() * spanMs);

      // Environ 60% des dossiers ont une date de fin renseignée.
      const hasDateFin = Math.random() < 0.6;
      const dateFin = hasDateFin
        ? new Date(dateDebut.getTime() + this.randomDays(30, 900))
        : null;

      // Un dossier ne peut être clôturé que s'il a une date de fin,
      // et environ la moitié des dossiers terminés sont clôturés.
      const hasCloture = hasDateFin && dateFin! < new Date() && Math.random() < 0.5;
      const dateCloture = hasCloture
        ? new Date(dateFin!.getTime() + this.randomDays(1, 60))
        : null;

      result.push({
        id: i + 1,
        numeroDossier: `DOS-${(2019 + (i % 6))}-${String(1000 + i).padStart(6, '0')}`,
        numeroAssure: `ASS${String(100000 + i * 7).padStart(8, '0')}`,
        genre,
        nom,
        prenom,
        dateDebut,
        dateFin,
        dateCloture,
      });
    }

    return result;
  }

  private randomDays(min: number, max: number): number {
    const days = min + Math.random() * (max - min);
    return days * 24 * 60 * 60 * 1000;
  }
}
