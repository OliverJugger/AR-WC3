import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthStore } from '../core/services/auth-store';
import { MatDivider } from "@angular/material/divider";
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgOptimizedImage
],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly loginFailed = signal(false);
  protected readonly hidePassword = signal(true);

  /** Formulaire de connexion avec un validateur de base (champs requis). */
  protected readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.loginFailed.set(false);

    this.authStore.login(this.form.getRawValue()).subscribe({
      next: (success) => {
        this.isSubmitting.set(false);
        if (success) {
          this.router.navigateByUrl('/menu');
        } else {
          this.loginFailed.set(true);
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.loginFailed.set(true);
      },
    });
  }
}
