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
  expandParent: boolean;
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

export interface MenuNode {
  name: string;
  code_arthus: string;
  route?: string;
  children?: MenuNode[];
}

/**
 * Recherche récursive du chemin (liste de noeuds) menant à l'élément
 * dont le code_arthus correspond, en partant de la racine.
 */
function findPath(nodes: MenuNode[], codeArthus: string, path: MenuNode[] = []): MenuNode[] | null {
  for (const node of nodes) {
    const currentPath = [...path, node];

    if (node.code_arthus === codeArthus) {
      return currentPath;
    }

    if (node.children?.length) {
      const found = findPath(node.children, codeArthus, currentPath);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * Retourne la chaîne "Parent le plus haut > ... > Élément"
 * pour un code_arthus donné, ou null si non trouvé.
 */
export function getBreadcrumb(tree: MenuNode[], codeArthus: string): string | null {
  const path = findPath(tree, codeArthus);
  if (!path) {
    return null;
  }
  return path.slice(0, -1).map(n => n.name).join(' > ');
}
