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
 * Profondeur maximale : 5 niveaux. Le suffixe numéroté de chaque nom reflète
 * sa position dans l'arbre (ex: "1.1.2" = 2ème enfant de "1.1").
 */
export interface NavTreeNode {
  name: string;
  route?: string;
  exampleId?: 1 | 2;
  children?: NavTreeNode[];
}

function buildBranch(rootLabel: string, routePrefix: string, exampleId: 1 | 2): NavTreeNode {
  return {
    name: rootLabel,
    children: [
      {
        name: `${rootLabel} spécifique 1`,
        children: [
          {
            name: `${rootLabel} spécifique 1.1`,
            children: [
              {
                name: `${rootLabel} spécifique 1.1.1`,
                children: [
                  {
                    name: `${rootLabel} spécifique 1.1.1.1`,
                    route: `${routePrefix}/1/1-1/1-1-1/1-1-1-1`,
                    exampleId,
                  },
                  {
                    name: `${rootLabel} spécifique 1.1.1.2`,
                    route: `${routePrefix}/1/1-1/1-1-1/1-1-1-2`,
                  },
                ],
              },
              {
                name: `${rootLabel} spécifique 1.1.2`,
                route: `${routePrefix}/1/1-1/1-1-2`,
              },
            ],
          },
          {
            name: `${rootLabel} spécifique 1.2`,
            route: `${routePrefix}/1/1-2`,
          },
        ],
      },
      {
        name: `${rootLabel} spécifique 2`,
        route: `${routePrefix}/2`,
      },
    ],
  };
}

export const NAV_TREE: NavTreeNode[] = [
  buildBranch('Menu paramétrage', 'parametrage', 1),
  buildBranch('Menu rapports', 'rapports', 2),
];

export interface NavLeafRoute {
  path: string;
  title: string;
  exampleId?: 1 | 2;
}

/** Parcourt l'arbre et retourne, à plat, toutes les feuilles porteuses d'une route. */
export function collectLeafRoutes(nodes: NavTreeNode[]): NavLeafRoute[] {
  const leaves: NavLeafRoute[] = [];
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      leaves.push(...collectLeafRoutes(node.children));
    } else if (node.route) {
      leaves.push({ path: node.route, title: node.name, exampleId: node.exampleId });
    }
  }
  return leaves;
}
