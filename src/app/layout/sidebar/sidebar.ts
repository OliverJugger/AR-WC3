import { Component, signal, computed, viewChild, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { NAV_TREE, NavTreeNode } from '../../core/navigation/nav-tree';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';

/** Nœud "aplati" consommé par mat-tree (voir l'exemple officiel "Tree with flat data source"). */
interface FlatNavNode {
  name: string;
  route?: string;
  code_arthus: string;
  level: number;
  expandable: boolean;
  highlighted: boolean;
}

/**
 * Barre latérale de navigation, collapsable.
 *
 * - `NAV_TREE` : arborescence de navigation façon explorateur de fichiers,
 *   affichée via `mat-tree`. Les noms trop longs sont tronqués en CSS
 *   (ellipsis) et affichés en entier au survol via `matTooltip`.
 */
@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly collapsed = signal(false);

  searchControl = new FormControl('', { nonNullable: true });

  private readonly treeFlattener = new MatTreeFlattener<NavTreeNode, FlatNavNode>(
    (node, level) => ({
      name: node.name,
      route: node.route ? `/${node.route}` : undefined,
      code_arthus: node.code_arthus,
      level,
      expandable: !!node.children && node.children.length > 0,
      highlighted: node.highlighted,
    }),
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  protected readonly treeControl = new FlatTreeControl<FlatNavNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  protected readonly dataSourceFiltered = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  protected readonly dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  protected readonly hasChild = (_: number, node: FlatNavNode): boolean => node.expandable;

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(query => this.search(query));

    this.dataSource.data = NAV_TREE;
  }

  protected toggleCollapsed(): void {
    this.collapsed.update((value) => !value);
  }

  search(searchValue:string) {
    // reset avec highlight systematiquement
    this.resetHightLight(NAV_TREE);
    this.dataSource.data = NAV_TREE;

    if (searchValue) {
      this.dataSource.data = this.filterTree(NAV_TREE, searchValue);
    }
  }

  clearSearch(input: HTMLInputElement) {
    this.searchControl.setValue('');
    input.focus();
    this.resetHightLight(NAV_TREE);
    this.dataSource.data = NAV_TREE;
  }

  private resetHightLight(nodes: NavTreeNode[]) {
    nodes.forEach(node => {
      node.highlighted = false;
      if(node.children && node.children.length > 0) {
        this.resetHightLight(node.children);
      }
    })
  }

  private filterTree(nodes: NavTreeNode[], searchTerm: string): NavTreeNode[] {  
    const term = searchTerm.toLowerCase().trim();    
  
    return nodes.reduce<NavTreeNode[]>((acc, node) => {
      const nameOrArthusCodeMatches = node.name.toLowerCase().includes(term) 
        || node.code_arthus.toLowerCase() === term;
  
      // On filtre récursivement les enfants
      const filteredChildren = node.children
        ? this.filterTree(node.children, term)
        : [];
  
      // On garde le nœud si son nom correspond OU si au moins un enfant correspond
      if (nameOrArthusCodeMatches || filteredChildren.length > 0) {
        node.highlighted = nameOrArthusCodeMatches;
        acc.push({
          ...node,
          // On ne garde que les enfants qui matchent
          children: nameOrArthusCodeMatches
          ? node.children
          : filteredChildren
        });
      }
  
      return acc;
    }, []);
  }

}
