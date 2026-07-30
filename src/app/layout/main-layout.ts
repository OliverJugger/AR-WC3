import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

/**
 * Layout applicatif affiché sur toutes les pages sauf la connexion :
 * header en haut, menu latéral collapsable à gauche, contenu de la route à droite.
 */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar, BreadcrumbComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
