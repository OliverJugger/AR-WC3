import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Page générique utilisée par toutes les feuilles de `NAV_TREE` qui n'ont
 * pas de composant dédié. Le titre affiché vient de `route.data.title`
 * (voir la génération des routes dans `app.routes.ts`).
 */
@Component({
  selector: 'app-page-placeholder',
  templateUrl: './page-placeholder.html',
  styleUrl: './page-placeholder.scss',
})
export class PagePlaceholder {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = (this.route.snapshot.data['title'] as string | undefined) ?? 'Page';
}
