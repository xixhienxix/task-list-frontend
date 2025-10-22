import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../_services/auth.service';

/**
 * Guard service responsible for protecting routes that require authentication.
 *
 * This guard verifies if a user is logged in by checking their authentication status
 * through the `AuthService`. If the user is not authenticated, it automatically
 * redirects them to the login page.
 *
 * @example
 * ```ts
 * const routes: Routes = [
 *   { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
 *   { path: 'login', component: LoginComponent },
 * ];
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  /**
   * Creates an instance of the `AuthGuardService`.
   *
   * @param _authService - Service used to check the user's login status.
   * @param router - Angular Router used for navigation.
   */
  constructor(
    public _authService: AuthService,
    public router: Router
  ) {}

  /**
   * Determines whether a route can be activated based on the user's login status.
   *
   * @returns `true` if the user is logged in, otherwise redirects to `/login` and returns `false`.
   *
   * @remarks
   * - Uses the `AuthService.isLoggedIn()` method to check authentication.
   * - Clears local storage if the user is not authenticated.
   * - Typically used in route definitions via the `canActivate` property.
   *
   * @example
   * ```ts
   * canActivate(): boolean {
   *   return this.authGuardService.canActivate();
   * }
   * ```
   */
  canActivate(): boolean {
    if (this._authService.isLoggedIn()) {
      return true;
    } else {
      localStorage.removeItem('email');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
