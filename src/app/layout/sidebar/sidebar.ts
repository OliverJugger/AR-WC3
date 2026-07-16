import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';

import { NAV_TREE, NavTreeNode } from '../../core/navigation/nav-tree';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

/** Nœud "aplati" consommé par mat-tree (voir l'exemple officiel "Tree with flat data source"). */
interface FlatNavNode {
  name: string;
  route?: string;
  level: number;
  expandable: boolean;
}

/**
 * Barre latérale de navigation, collapsable.
 *
 * - `navItems` : entrées "épinglées" en haut (ex: Accueil).
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
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly collapsed = signal(false);

  protected readonly navItems: NavItem[] = [{ label: 'Accueil', icon: 'dashboard', route: '/home' }];

  private readonly treeFlattener = new MatTreeFlattener<NavTreeNode, FlatNavNode>(
    (node, level) => ({
      name: node.name,
      route: node.route ? `/${node.route}` : undefined,
      level,
      expandable: !!node.children && node.children.length > 0,
    }),
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  protected readonly treeControl = new FlatTreeControl<FlatNavNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  protected readonly dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  protected readonly hasChild = (_: number, node: FlatNavNode): boolean => node.expandable;

  constructor() {
    this.dataSource.data = NAV_TREE;
  }

  protected toggleCollapsed(): void {
    this.collapsed.update((value) => !value);
  }
}
