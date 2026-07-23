import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { DossierSearchApi } from './dossier-search-api';
import {
  DossierIndividu,
  DossierSearchRequest,
  DossierSinistre,
  DossierSinistreCriteria,
  PageDossierSinistre,
} from './dossier.model';

/**
 * Service FICTIF simulant le back-end.
 * - Génère un jeu de données brutes en mémoire au démarrage, au format du
 *   contrat (`DossierSinistre` avec `Individu` imbriqué).
 * - Applique la recherche multi-critères et la pagination côté "serveur" simulé.
 *
 * Voir `DossierSinistreApiService` pour l'implémentation réelle (HttpClient)
 * respectant la même interface `DossierSearchApi`.
 */
@Injectable({ providedIn: 'root' })
export class DossierMockService extends DossierSearchApi {
  /** Latence artificielle pour simuler un appel réseau (ms). */
  private static readonly SIMULATED_LATENCY = 350;

  private readonly dossiers: DossierSinistre[] = this.generateMockData(137);

  search(request: DossierSearchRequest): Observable<PageDossierSinistre> {
    const filtered = this.applyFilters(this.dossiers, request.criteria);
    const sorted = this.applySort(
      filtered,
      request.sortField ?? null,
      request.sortDirection ?? ''
    );

    const start = request.page * request.size;
    const end = start + request.size;
    const data = sorted.slice(start, end);

    const result: PageDossierSinistre = {
      page: request.page,
      pageSize: request.size,
      count: data.length,
      totalCount: sorted.length,
      data,
    };

    return of(result).pipe(delay(DossierMockService.SIMULATED_LATENCY));
  }

  // ---------------------------------------------------------------------
  // Filtrage
  // ---------------------------------------------------------------------

  private applyFilters(
    data: DossierSinistre[],
    criteria: DossierSinistreCriteria
  ): DossierSinistre[] {
    return data.filter((d) => {
      if (criteria.nomIndividuContains && !this.contains(d.individu?.nom, criteria.nomIndividuContains)) {
        return false;
      }
      if (
        criteria.prenomIndividuContains &&
        !this.contains(d.individu?.prenom, criteria.prenomIndividuContains)
      ) {
        return false;
      }
      if (criteria.anterieur !== undefined && criteria.anterieur !== null) {
        const isAnterieur = d.anterieur === 'O';
        if (isAnterieur !== criteria.anterieur) {
          return false;
        }
      }
      if (criteria.finNull !== undefined && criteria.finNull !== null) {
        const finEstNulle = !d.fin;
        if (finEstNulle !== criteria.finNull) {
          return false;
        }
      }
      if (!this.inRange(d.debut, criteria.debutFrom, criteria.debutTo)) {
        return false;
      }
      if (!this.inRange(d.fin, criteria.finFrom, criteria.finTo)) {
        return false;
      }
      return true;
    });
  }

  private contains(value: string | undefined, search: string): boolean {
    return (value ?? '').toLocaleLowerCase().includes(search.trim().toLocaleLowerCase());
  }

  private inRange(value: string | null | undefined, from?: string, to?: string): boolean {
    if (!from && !to) {
      return true;
    }
    if (!value) {
      // Une ligne sans date (ex: dossier non clôturé) ne matche pas un filtre de plage.
      return false;
    }
    const time = this.stripTime(new Date(value)).getTime();
    if (from && time < this.stripTime(new Date(from)).getTime()) {
      return false;
    }
    if (to && time > this.stripTime(new Date(to)).getTime()) {
      return false;
    }
    return true;
  }

  private stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  // ---------------------------------------------------------------------
  // Tri (mock uniquement : le contrat ne définit pas de tri serveur)
  // ---------------------------------------------------------------------

  private applySort(
    data: DossierSinistre[],
    field: DossierSearchRequest['sortField'],
    direction: 'asc' | 'desc' | ''
  ): DossierSinistre[] {
    if (!field || !direction) {
      return data;
    }
    const factor = direction === 'asc' ? 1 : -1;
    const getValue = (d: DossierSinistre): string | number => {
      switch (field) {
        case 'numeroDossier':
          return d.idDossier;
        case 'numeroAssure':
          return d.individu?.numassu ?? 0;
        case 'assure':
          return `${d.individu?.nom ?? ''} ${d.individu?.prenom ?? ''}`;
        case 'dateDebut':
          return d.debut ? new Date(d.debut).getTime() : 0;
        case 'dateFin':
          return d.fin ? new Date(d.fin).getTime() : 0;
        case 'dateCloture':
          return d.cloture ? new Date(d.cloture).getTime() : 0;
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

  private generateMockData(count: number): DossierSinistre[] {
    const noms = [
      'MARTIN', 'BERNARD', 'THOMAS', 'ROBERT', 'PETIT', 'DURAND', 'LEROY',
      'MOREAU', 'SIMON', 'LAURENT', 'LEFEBVRE', 'MICHEL', 'GARCIA', 'DAVID',
      'BERTRAND', 'ROUX', 'VINCENT', 'FONTAINE', 'CHEVALIER', 'GAUTHIER',
    ];
    const prenomsH = ['Jean', 'Pierre', 'Michel', 'Alain', 'Philippe', 'Nicolas', 'Olivier', 'Marc'];
    const prenomsF = ['Marie', 'Sophie', 'Isabelle', 'Nathalie', 'Catherine', 'Julie', 'Claire', 'Sandrine'];

    const result: DossierSinistre[] = [];
    const baseDate = new Date(2019, 0, 1).getTime();
    const spanMs = 1000 * 60 * 60 * 24 * 365 * 6; // ~6 ans d'étalement

    const maxIdDossier = 999999999;

    for (let i = 0; i < count; i++) {
      const sexe = i % 2 === 0 ? 1 : 2; // 1 = M, 2 = Mme
      const nom = noms[i % noms.length];
      const prenom = sexe === 1 ? prenomsH[i % prenomsH.length] : prenomsF[i % prenomsF.length];

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

      const individu: DossierIndividu = {
        numindiv: 1000 + i,
        nom,
        prenom,
        sexe,
        numassu: 100000 + i * 7,
      };

      result.push({
        idDossier: `${String(Math.round(Math.random() * maxIdDossier)).padStart(9, '0')}`,
        refExt: null,
        individu,
        anterieur: Math.random() < 0.15 ? 'O' : 'N',
        debut: dateDebut.toISOString(),
        fin: dateFin ? dateFin.toISOString() : null,
        cloture: dateCloture ? dateCloture.toISOString() : null,
      });
    }

    return result;
  }

  private randomDays(min: number, max: number): number {
    const days = min + Math.random() * (max - min);
    return days * 24 * 60 * 60 * 1000;
  }
}
