import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';

/**
 * Layout applicatif affiché sur toutes les pages sauf la connexion :
 * header en haut, menu latéral collapsable à gauche, contenu de la route à droite.
 */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
