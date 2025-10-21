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

  constructor(
    private _authService: AuthService,
    private router: Router
  ) { }

  email: string = ''
  password: string = ''
  loginValidate: boolean = false
  loading: boolean = false;
  errorMessage: AuthResponse = AUTH_RESPONSE_DEFAULT

  private handleResponse(obs: Observable<any>) {
    this.loading = true;

    obs.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (response: any) => {

        if (response.errorCode) {
          this.errorMessage = response;
        }
        else if (response.success) {

          this.errorMessage = {
            errorCode: 0,
            message: `Email ${response.email} registrado con éxito. Redirigiendo...`
          };
            localStorage.setItem('email',this.email);
            this.router.navigate(['/dashboard']);
        }
        else if (response.message) {

          this.errorMessage = {
            errorCode: 0,
            message: response.message
          };
          localStorage.setItem('email',this.email);
          this.router.navigate(['/dashboard']); 
        }
        else {
          this.errorMessage = AUTH_RESPONSE_DEFAULT;
        }
      },
      error: (err: AuthResponse) => {
        this.errorMessage = err;
        console.log('Error:', err)
      },
    });
  }

  onLogin() {
    this.handleResponse(this._authService.postLogin(this.email));
  }

  onRegister() {
    this.handleResponse(this._authService.signUp(this.email));
  }
}
