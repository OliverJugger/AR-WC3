import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface BreadcrumbSegment {
  label: string;
  path: string;
  queryParams: Params;
  clickable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private segmentsSubject = new BehaviorSubject<BreadcrumbSegment[]>([]);
  public segments$ = this.segmentsSubject.asObservable();

  private segments: BreadcrumbSegment[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.update());
  }

  private update(): void {
    const snapshot = this.getLeafSnapshot(this.activatedRoute.snapshot);
    const data = snapshot.data as { hierarchy?: string; title?: string };

    if (!data.title) {
      return;
    }

    const isContextual = Object.keys(snapshot.queryParams).length > 0;

    // Au moment de capturer l'URL courante
    const urlTree = this.router.parseUrl(this.router.url);
    const path = urlTree.root.children['primary']?.segments
        .map(s => s.path)
        .join('/');
    const queryParams = urlTree.queryParams;

    const newSegment: BreadcrumbSegment = {
      label: data.title,
      path,
      queryParams,
      clickable: true
    };

    if (isContextual) {
      // Si on navigue vers un segment déjà présent dans le fil (ex: clic sur le breadcrumb),
      // on revient en arrière au lieu de concaténer un nouveau segment à la suite
      const existingIndex = this.segments.findIndex(segment => segment.path === path);
      if (existingIndex !== -1) {
        this.segments = [...this.segments.slice(0, existingIndex), newSegment];
      } else {
        // On garde l'état actuel du breadcrumb et on ajoute le nouveau titre
        this.segments = [...this.segments, newSegment];
      }
    } else {
      // Reset : on repart de la hiérarchie de cette route + son titre
      const hierarchySegments: BreadcrumbSegment[] = (data.hierarchy ?? '')
        .split('>')
        .map(part => part.trim())
        .filter(part => part.length > 0)
        .map(label => ({ label, path: '', queryParams: {}, clickable: false }));

      this.segments = [...hierarchySegments, newSegment];
    }

    this.segmentsSubject.next(this.segments);
  }

  private getLeafSnapshot(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let current = snapshot;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
  }
}