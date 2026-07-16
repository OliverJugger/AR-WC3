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

export const NAV_TREE: NavTreeNode[] = [
  {
    name: 'Accueil',
    route: `home`,
  },
  {    
    name: 'Paramétrage',
    children: [
      {
        name: `Codification de base`,
        children: [
          {
            name: `Codification utilisateur`,
            route: `parametrage/codification-utilisateur`
          },
          {
            name: `Codification système`,
            children: [
              {
                name: `Codification système`,
                route: `parametrage/codification-systeme`
              },
              {
                name: `Codification système alphanumérique`,
                route: `parametrage/codification-systeme-alphanumerique`
              }
            ]
          },
          {
            name: `Codification utilisateur alphanumérique`,
            route: `parametrage/codification-utilisateur-alphanumerique`
          },
          {
            name: `Codification super système`,
            children: [
              {
                name: `Aide sur les données utilisateur`,
                route: `parametrage/aide-donnees-utilisateur`
              },
              {
                name: `Codification virtuelle numérique`,
                route: `parametrage/codification-virtuelle-numerique`
              },
              {
                name: `Codification virtuelle alphanumérique`,
                route: `parametrage/codification-virtuelle-alphanumerique`
              }
            ]
          },
          {
            name: `Pays, devises`,
            children: [
              {
                name: `Pays`,
                route: `parametrage/pays`
              },
              {
                name: `Départements`,
                route: `parametrage/departements`
              },
              {
                name: `Devises`,
                route: `parametrage/devises`
              },
              {
                name: `Cours de change`,
                route: `parametrage/cours-de-change`
              }
            ]
          },
          {
            name: `Editions "Codification de base`,
            children: [
              {
                name: `Codification Utilisateur`,
                route: `parametrage/codification-utilisateur`
              },
              {
                name: `Codification système`,
                route: `parametrage/codification-systeme`
              },
              {
                name: `Aide sur les données utilisateur`,
                route: `parametrage/aide-donnees-utilisateur`
              }
            ]
          },
        ],
      },
      {
        name: `Codification de soins de santé`,
        children: [
          {
            name: `Paramétrage du parcours de soins`,
            children: [
              {
                name: `Paramétrage des taux et plafonds`,
                route: `parametrage/taux-plafonds`
              },
              {
                name: `Spécialités médicales`,
                route: `parametrage/specialite-medicales`
              },
              {
                name: `Spécialités médicales exclues`,
                route: `parametrage/specialite-medicales-exclues`
              }
            ],
          },
          {
            name: `Régimes de base`,
            route: `parametrage/regime-base`
          },
          {
            name: `Familles/Actes`,
            route: `parametrage/familles-actes`
          },
          {
            name: `Liste des formules soins de santé`,
            route: `parametrage/formules-soins-sante`
          },
          {
            name: `Secteurs d'activité`,
            route: `parametrage/secteurs-activite`
          },
          {
            name: `Formules de prestations soins de santé`,
            route: `parametrage/formules-prestations-soins-sante`
          },
          {
            name: `Paramétrage des domaines Tiers payant`,
            route: `parametrage/domaines-tiers-payant`
          },
          {
            name: `Editions "Codification soins de santé"`,
            children: [
              {
                name: `Codes actes`,
                route: `parametrage/edition-codes-actes`
              },
              {
                name: `Tarifs avec historique des valeurs`,
                route: `parametrage/edition-tarifs-historique-valeurs`
              },
              {
                name: `Formules de prestation soins de santé`,
                route: `parametrage/edition-formules-prestation-soins-sante`
              }
            ],
          }
        ],
      },
      {
        name: `Paramétrage des portes externes`,
        children: [
          {
            name: `Paramétrage des portes externes`,
            route: `parametrage/portes-externes`
          },
          {
            name: `Transcodification des actes`,
            route: `parametrage/transcodification-actes`
          },
          {
            name: `Zones de tarification`,
            route: `parametrage/zones-tarification`
          },
          {
            name: `Actes d'un régime`,
            route: `parametrage/actes-regime`
          },
          {
            name: `Paramétrage des I.E.M.I.E.`,
            route: `parametrage/iemie`
          },
        ],
      },
      {
        name: `Transcodifications externes`,
        route: `parametrage/transcodifications-externes`
      },
      {
        name: `Courriers, extractions`,
        children: [
          {
            name: `Définition des modèles de courrier`,
            route: `parametrage/definition-modeles-courrier`
          },
          {
            name: `Définition des messages de courriers`,
            route: `parametrage/definition-messages-courriers`
          },
          {
            name: `Opérations de gestion "Courriers"`,
            route: `parametrage/operations-gestion-courriers`
          },
          {
            name: `Organisation des courriers`,
            route: `parametrage/organisation-courriers`
          },
          {
            name: `Edition des modèles de courriers généraux`,
            route: `parametrage/edition-modeles-courrier-generaux`
          }
        ],
      },
      {
        name: `Formules, indices, tableaux, ...`,
        children: [
          {
            name: `Codification utilisateur`,
            route: `parametrage/codification-utilisateur`
          }
        ],
      },
      {
        name: `Utilisateurs, périphériques, habilitations`,
        children: [
          {
            name: `Codification utilisateur`,
            route: `parametrage/codification-utilisateur`
          }
        ],
      },
      {
        name: `Comptabilité`,
        children: [
          {
            name: `Codification utilisateur`,
            route: `parametrage/codification-utilisateur`
          }
        ],
      },
      {
        name: `Sociétés de gestion`,
        children: [
          {
            name: `Codification utilisateur`,
            route: `parametrage/codification-utilisateur`
          }
        ],
      },
      {
        name: `Interfaces`,
        children: [
          {
            name: `Codification utilisateur`,
            route: `parametrage/codification-utilisateur`
          }
        ],
      },
      {
        name: `Système`,
        children: [
          {
            name: `Codification utilisateur`,
            route: `parametrage/codification-utilisateur`
          }
        ],
      }
    ],
  },
  {
    name: 'Personnes',
    children: [
      {
        name: `X`,
        children: [
          {
            name: `XXX`,
            children: [
              {
                name: `XXXX`,
                route: `parametrage/codification-systeme`
              }
            ]
          },
        ],
      }
    ],
  },
  {
    name: 'Production',
    children: [
      {
        name: `XXXX`,
        route: `parametrage/codification-systeme`
      }
    ]
  },
  {
    name: 'Cotisations',
    children: [
      {
        name: `XXXX`,
        route: `parametrage/codification-systeme`
      }
    ]
  },
  {
    name: 'Prestations soins de santé',
    children: [
      {
        name: `XXXX`,
        route: `parametrage/codification-systeme`
      }
    ]
  },
  {
    name: 'Prestations prévoyance',
    children: [
      {
        name: `XXXX`,
        route: `parametrage/codification-systeme`
      }
    ]
  },
  {
    name: 'Opérations "Délégataires"',
    children: [
      {
        name: `XXXX`,
        route: `parametrage/codification-systeme`
      }
    ]
  },
  {
    name: 'Opérations "Délégants',
    children: [
      {
        name: `XXXX`,
        route: `parametrage/codification-systeme`
      }
    ]
  },
  {
    name: 'Opérations "Régimes Obligatoires"',
    children: [
      {
        name: `XXXX`,
        route: `parametrage/codification-systeme`
      }
    ]
  },
  {
    name: 'Trésorerie',
    children: [
      {
        name: `XXXX`,
        route: `parametrage/codification-systeme`
      }
    ]
  },
  {
    name: 'Fiscalité',
    children: [
      {
        name: `XXXX`,
        route: `parametrage/codification-systeme`
      }
    ]
  },
  {
    name: 'Comptabilisation',
    children: [
      {
        name: `XXXX`,
        route: `parametrage/codification-systeme`
      }
    ]
  },
  {
    name: 'Statistiques et pilotage',
    children: [
      {
        name: `XXXX`,
        route: `parametrage/codification-systeme`
      }
    ]
  },
  {
    name: 'Traitements différés',
    children: [
      {
        name: `XXXX`,
        route: `parametrage/codification-systeme`
      }
    ]
  },
  {
    name: 'Interfaces',
    children: [
      {
        name: `XXXX`,
        route: `parametrage/codification-systeme`
      }
    ]
  }
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
