import { CommonModule, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { DossierSearchApi } from './dossier-search-api';
import { DossierMockService } from './dossier-mock.service';
import { DossierSinistreApiService } from './dossier-sinistre-api.service';
import {
  DossierSinistre,
  DossierSinistreCriteria,
  DossierSortField,
} from './dossier.model';
import { PaginatorComponent } from '../../../shared/paginator/paginator.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dossier-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    PaginatorComponent,
    MatSortModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatTooltipModule,
    RouterLink,
  ],
  templateUrl: './pv22.html',
  styleUrl: './pv22.scss',
  providers: [
    {
      // Bascule mock / back-end réel selon `environment.useMock`, sans
      // toucher au reste du composant (les deux services respectent la
      // même interface `DossierSearchApi`).
      provide: DossierSearchApi,
      useFactory: () =>
        environment.useMock ? inject(DossierMockService) : inject(DossierSinistreApiService),
    },
  ],
})
export class Pv22 implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly dossierService = inject(DossierSearchApi);
  private readonly destroy$ = new Subject<void>();

  @ViewChild(MatSort) sort?: MatSort;

  readonly displayedColumns: string[] = [
    'numeroDossier',
    'numeroAssure',
    'assure',
    'dateDebut',
    'dateFin',
    'dateCloture',
    'action',
  ];

  // ---- État réactif exposé au template -----------------------------------
  readonly data = signal<DossierSinistre[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly filtersPanelOpen = signal(false);

  readonly pageIndex = signal(1);
  readonly pageSize = signal(10);
  private sortField: DossierSortField | null = null;
  private sortDirection: 'asc' | 'desc' | '' = '';

  search = signal('');
  previousValue = '';

  /** Filtres avancés (contrat : `DossierSinistreCriteria`, hors nom). */
  readonly filtersForm = this.fb.group({
    prenomIndividuContains: [''],
    anterieur: [null as boolean | null],
    finNull: [null as boolean | null],
    debutFrom: [null as Date | null],
    debutTo: [null as Date | null],
    finFrom: [null as Date | null],
    finTo: [null as Date | null],
  });

  constructor() {
    effect(() => {
      if(this.previousValue !== this.search()) {
        this.onSearch();
      }
      this.previousValue = this.search();
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Déclenché par le champ "Rechercher" : revient à la première page. */
  onSearch(): void {
    this.pageIndex.set(1);
    this.loadPage();
  }

  /** Réinitialise le formulaire et relance une recherche vierge. */
  onReset(): void {
    this.filtersForm.reset();
    this.pageIndex.set(1);
    this.loadPage();
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
    this.loadPage();
  }

  onSortChange(sort: Sort): void {
    this.sortField = (sort.direction ? (sort.active as DossierSortField) : null);
    this.sortDirection = sort.direction;
    this.pageIndex.set(1);
    this.loadPage();
  }

  /** Libellé affiché dans la colonne "Assuré" : Genre + Nom + Prénom. */
  assureLabel(row: DossierSinistre): string {
    const genre = row.individu?.sexe === 1 ? 'M' : row.individu?.sexe === 2 ? 'Mme' : '';
    return `${genre} ${row.individu?.nom ?? ''} ${row.individu?.prenom ?? ''}`.trim();
  }

  /** N° assuré affiché : `Individu.numassu`. */
  numeroAssure(row: DossierSinistre): string {
    return row.individu?.numassu != null ? String(row.individu.numassu) : '—';
  }

  toggleFiltersPanel(): void {
    this.filtersPanelOpen.update((open) => !open);
  }

  private loadPage(): void {
    this.loading.set(true);

    const formValue = this.filtersForm.getRawValue();
    const criteria: DossierSinistreCriteria = {
      nomIndividuContains: this.search().trim() || undefined,
      prenomIndividuContains: formValue.prenomIndividuContains?.trim() || undefined,
      anterieur: formValue.anterieur ?? undefined,
      finNull: formValue.finNull ?? undefined,
      debutFrom: this.toIsoDate(formValue.debutFrom),
      debutTo: this.toIsoDate(formValue.debutTo),
      finFrom: this.toIsoDate(formValue.finFrom),
      finTo: this.toIsoDate(formValue.finTo),
    };

    this.dossierService
      .search({
        criteria,
        page: this.pageIndex() - 1,
        size: this.pageSize(),
        sortField: this.sortField,
        sortDirection: this.sortDirection,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.data.set(result.data);
          this.total.set(result.totalCount);
          this.loading.set(false);
        },
        error: () => {
          this.data.set([]);
          this.total.set(0);
          this.loading.set(false);
        },
      });
  }

  private toIsoDate(value: Date | null): string | undefined {
    return value ? formatDate(value, 'yyyy-MM-dd', 'en-US') : undefined;
  }
}
