/**
 * @fileoverview
 * `AuthComponent` — Component for handling user authentication (login and registration).
 *
 * Provides a simple form for email authentication. Handles API requests via
 * `AuthService`, shows loading indicators with `SpinnerComponent`, and
 * displays notifications with `SuccessDialogComponent`.
 *
 * Standalone Angular Material component with reactive forms and basic validation.
 *
 * @example
 * <app-auth.component></app-auth.component>
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { SpinnerComponent } from '../../_helpers/spinner.component';
import { finalize, Observable } from 'rxjs';
import { AUTH_RESPONSE_DEFAULT, AuthResponse } from '../../models/auth.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../_helpers/_modals/notification.modal.component';

/**
 * Component responsible for user authentication.
 *
 * Manages login and registration forms, triggers backend requests via
 * `AuthService`, handles success/error messages, and manages user session
 * in `localStorage`.
 */
@Component({
  selector: 'app-auth.component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    SpinnerComponent
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  /**
   * User email input.
   */
  email: string = '';

  /**
   * User password input.
   * (Not currently used in API calls, reserved for future use.)
   */
  password: string = '';

  /**
   * Indicates if login validation is required or active.
   */
  loginValidate: boolean = false;

  /**
   * Flag to indicate if a request is in progress.
   */
  loading: boolean = false;

  /**
   * Holds the latest authentication response or error message.
   */
  errorMessage: AuthResponse = AUTH_RESPONSE_DEFAULT;

  constructor(
    private _authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  /**
   * Handles authentication response from the backend.
   *
   * Shows loading state, processes the observable response, sets error messages,
   * updates localStorage on success, and navigates to dashboard.
   *
   * @param obs - Observable returned from AuthService (login or signup).
   */
  private handleResponse(obs: Observable<any>): void {
    this.loading = true;

    obs.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (response: any) => {
        if (response.errorCode) {
          this.errorMessage = response;
        } else if (response.success) {
          this.errorMessage = {
            errorCode: 0,
            message: `Email ${response.email} registrado con éxito. Redirigiendo...`
          };
          localStorage.setItem('email', this.email);
          this.router.navigate(['/dashboard']);
        } else if (response.message) {
          this.errorMessage = {
            errorCode: 0,
            message: response.message
          };
          this.onNotification(this.errorMessage.message ?? 'Iniciando Session');
          localStorage.setItem('email', this.email);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = AUTH_RESPONSE_DEFAULT;
        }
      },
      error: (err: AuthResponse) => {
        this.errorMessage = err;
        this.onNotification(this.errorMessage.message ?? 'Problemas con el inicio de session');
      },
    });
  }

  /**
   * Trigger login process.
   *
   * Calls AuthService.postLogin with the provided email.
   */
  onLogin(): void {
    this.handleResponse(this._authService.postLogin(this.email));
  }

  /**
   * Trigger user registration process.
   *
   * Calls AuthService.signUp with the provided email.
   */
  onRegister(): void {
    this.handleResponse(this._authService.signUp(this.email));
  }

  /**
   * Opens a success notification modal.
   *
   * @param mensaje - Message to display in the modal.
   */
  onNotification(mensaje: string): void {
    this.dialog.open(SuccessDialogComponent, {
      width: '300px',
      data: { message: mensaje },
    });
  }
}
