import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthStore } from '../../core/services/auth-store';

/**
 * En-tête affiché sur toutes les pages sauf la page de connexion.
 * Logo en haut à gauche, utilisateur connecté (donnée mockée) en haut à droite.
 */
@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly currentUser = this.authStore.currentUser;

  protected logout(): void {
    this.authStore.logout();
    this.router.navigateByUrl('/login');
  }
}
