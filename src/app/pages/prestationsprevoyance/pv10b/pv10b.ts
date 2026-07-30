import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
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
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';

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
    MatSortModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDividerModule,
    RouterLink,
  ],
  templateUrl: './pv10b.html',
  styleUrl: './pv10b.scss',
})
export class Pv10b implements OnInit, OnDestroy {
  
  // Signal inputs (Angular 21)
  assure = signal<Assure>({
    numeroDossier: '',
    numeroAssure: '',
    genre: '',
    nom: '',
    prenom: '',
    dateOuverture: '',
    dateFin: null,
    dateCloture: null
  });
  gestionnaire = signal<Gestionnaire>({
    numeroGestionnaire: '',
    nom: '',
    prenom: ''
  });
  sinistres = signal<Sinistre[]>([]);

  displayedColumns: string[] = [
    'numeroSinistre',
    'dateSurveillance',
    'risque',
    'dateFin',
    'motifFin',
  ];

  nomCompletAssure = computed(() => {
    const a = this.assure();
    return `${a.genre} ${a.nom} ${a.prenom}`.trim();
  });

  nomCompletGestionnaire = computed(() => {
    const g = this.gestionnaire();
    return `${g.nom} ${g.prenom}`.trim();
  });

  /**
   * Calcule une couleur graduelle pour un niveau de risque compris entre 0 et 5.
   * 0 -> vert (risque faible), 5 -> rouge (risque élevé).
   */
  getRisqueColor(value: number): string {
    const clamped = Math.max(0, Math.min(5, value));
    const hue = 120 - (clamped / 5) * 120; // 120° (vert) -> 0° (rouge)
    return `hsl(${hue}, 72%, 42%)`;
  }

  getRisqueTextColor(value: number): string {
    // Texte blanc pour une meilleure lisibilité sur toutes les teintes du dégradé
    return '#ffffff';
  }
  //

  route = inject(ActivatedRoute);
  queryParams = toSignal(this.route.queryParams);
  dossier = computed(() => this.queryParams()?.['dossier']);

  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    console.log('Pv10bComponent chargé, dossier =', this.dossier());

    var assureData: Assure = {
      numeroDossier: 'DOS-2026-00456',
      numeroAssure: 'ASS-778812',
      genre: 'M.',
      nom: 'Dupont',
      prenom: 'Jean',
      dateOuverture: '2022-03-15',
      dateFin: null,
      dateCloture: null,
    };

    var gestionnaireData: Gestionnaire = {
      numeroGestionnaire: 'GES-014',
      nom: 'Martin',
      prenom: 'Sophie',
    };

    var sinistresData: Sinistre[] = [
      {
        numeroSinistre: 'SIN-000123',
        dateSurveillance: '2023-01-10',
        risque: 1,
        dateFin: '2023-06-01',
        motifFin: 'Guérison',
      },
      {
        numeroSinistre: 'SIN-000456',
        dateSurveillance: '2024-02-20',
        risque: 3,
        dateFin: null,
        motifFin: '',
      },
      {
        numeroSinistre: 'SIN-000789',
        dateSurveillance: '2025-05-05',
        risque: 5,
        dateFin: null,
        motifFin: '',
      },
    ];

    this.assure.set(assureData);
    this.gestionnaire.set(gestionnaireData);
    this.sinistres.set(sinistresData);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

export interface Assure {
  numeroDossier: string;
  numeroAssure: string;
  genre: string; // 'M.' | 'Mme' | ...
  nom: string;
  prenom: string;
  dateOuverture: Date | string;
  dateFin: Date | string | null;
  dateCloture: Date | string | null;
}

export interface Gestionnaire {
  numeroGestionnaire: string;
  nom: string;
  prenom: string;
}

export interface Sinistre {
  numeroSinistre: string;
  dateSurveillance: Date | string;
  /** Niveau de risque de 0 (faible) à 5 (élevé) */
  risque: number;
  dateFin: Date | string | null;
  motifFin: string;
}

export class ExempleUtilisationComponent {
  assure: Assure = {
    numeroDossier: 'DOS-2026-00456',
    numeroAssure: 'ASS-778812',
    genre: 'M.',
    nom: 'Dupont',
    prenom: 'Jean',
    dateOuverture: '2022-03-15',
    dateFin: null,
    dateCloture: null,
  };

  gestionnaire: Gestionnaire = {
    numeroGestionnaire: 'GES-014',
    nom: 'Martin',
    prenom: 'Sophie',
  };

  sinistres: Sinistre[] = [
    {
      numeroSinistre: 'SIN-000123',
      dateSurveillance: '2023-01-10',
      risque: 1,
      dateFin: '2023-06-01',
      motifFin: 'Guérison',
    },
    {
      numeroSinistre: 'SIN-000456',
      dateSurveillance: '2024-02-20',
      risque: 3,
      dateFin: null,
      motifFin: '',
    },
    {
      numeroSinistre: 'SIN-000789',
      dateSurveillance: '2025-05-05',
      risque: 5,
      dateFin: null,
      motifFin: '',
    },
  ];
}