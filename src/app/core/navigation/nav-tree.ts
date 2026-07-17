import menu_tree from './menu_tree.json';

/**
 * Arborescence de navigation utilisée par la sidebar (mat-tree) et par la
 * génération des routes correspondantes (voir `app.routes.ts`).
 *
 * - Un nœud avec des `children` est une branche (dépliable, sans route).
 * - Un nœud sans `children` est une feuille : il doit porter un `route`
 *   (segment(s) de chemin relatif, sans slash de tête) et devient un lien.
 * - `exampleId` marque les 2 feuilles de démonstration qui pointent vers un
 *   composant dédié plutôt que vers la page générique `PagePlaceholder`.
 *
 */
export interface NavTreeNode {
  name: string;
  route?: string;
  code_arthus: string;
  children?: NavTreeNode[];
  highlighted: boolean;
}

export const NAV_TREE: NavTreeNode[] = menu_tree.map(item => ({
  ...item,
  highlighted: false,
})) as NavTreeNode[];

export interface NavLeafRoute {
  path: string;
  title: string;
  code_arthus: string;
}

/** Parcourt l'arbre et retourne, à plat, toutes les feuilles porteuses d'une route. */
export function collectLeafRoutes(nodes: NavTreeNode[]): NavLeafRoute[] {
  const leaves: NavLeafRoute[] = [];
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      leaves.push(...collectLeafRoutes(node.children));
    } else if (node.route) {
      leaves.push({ path: node.route, title: node.name, code_arthus : node.code_arthus });
    }
  }
  return leaves;
}
