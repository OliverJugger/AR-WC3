import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

import { ChartDatum } from '../core/api/models';
import { StatisticsApi } from '../core/api/statistics-api';

interface ChartCard {
  title: string;
  data: ChartDatum[];
}

/**
 * Page d'accueil : 4 graphiques "pie" disposés en carré (2x2), alimentés par
 * un appel à `GET /statistics` (voir `openapi/openapi.yaml`), mocké pour
 * l'instant via Mockoon / l'interceptor Angular.
 */
@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatProgressSpinnerModule, NgxChartsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly statisticsApi = inject(StatisticsApi);

  protected readonly loading = signal(true);
  protected readonly loadError = signal(false);
  protected readonly charts = signal<ChartCard[]>([]);

  protected readonly colorScheme: Color = {
    name: 'ar-wc3',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#673ab7', '#3f51b5', '#03a9f4', '#009688', '#8bc34a', '#ffc107', '#ff5722'],
  };

  constructor() {
    this.statisticsApi
      .getStatistics()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (response) => {
          this.charts.set([
            { title: 'Statistique 1', data: response.stat1 },
            { title: 'Statistique 2', data: response.stat2 },
            { title: 'Statistique 3', data: response.stat3 },
            { title: 'Statistique 4', data: response.stat4 },
          ]);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.loadError.set(true);
        },
      });
  }
}
