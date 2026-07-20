import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, computed, effect, inject, signal } from '@angular/core';
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
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';

import { DossierMockService } from '../pv22/dossier-mock.service';
import {
  DossierAssure,
  DossierSearchCriteria,
  DossierSortField,
} from '../pv22/dossier.model';
import { PaginatorComponent } from '../../../shared/paginator/paginator.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dossier-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
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
  templateUrl: './pv10b.html',
  styleUrl: './pv10b.scss',
})
export class Pv10b implements OnInit, OnDestroy {

  route = inject(ActivatedRoute);
  queryParams = toSignal(this.route.queryParams);
  dossier = computed(() => this.queryParams()?.['dossier']);

  private readonly fb = inject(FormBuilder);
  private readonly dossierService = inject(DossierMockService);
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
  readonly data = signal<DossierAssure[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly filtersPanelOpen = signal(false);

  readonly pageIndex = signal(1);
  readonly pageSize = signal(10);
  private sortField: DossierSortField | null = null;
  private sortDirection: 'asc' | 'desc' | '' = '';

  search = signal('');
  previousValue = '';

  constructor() {
    effect(() => {
      if(this.previousValue !== this.search()) {
        this.onSearch();
      }
      this.previousValue = this.search();
    });
  }

  ngOnInit(): void {
    console.log('Pv10bComponent chargé, dossier =', this.dossier());
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
  assureLabel(row: DossierAssure): string {
    return `${row.genre} ${row.nom} ${row.prenom}`;
  }

  toggleFiltersPanel(): void {
    this.filtersPanelOpen.update((open) => !open);
  }

  private loadPage(): void {
    this.loading.set(true);

    const raw = this.search();
    const criteria: DossierSearchCriteria = {
      genericSearch: raw
    };

    this.dossierService
      .search({
        criteria,
        pageIndex: this.pageIndex(),
        pageSize: this.pageSize(),
        sortField: this.sortField,
        sortDirection: this.sortDirection,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.data.set(result.items);
          this.total.set(result.total);
          this.loading.set(false);
        },
        error: () => {
          this.data.set([]);
          this.total.set(0);
          this.loading.set(false);
        },
      });
  }
}
