import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../_services/auth.service';


@Injectable({
	providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
	constructor(public _authService: AuthService,
        public router: Router) { }

	/**
	 * Checks if the user has a valid token or not.
	 * @returns The current users logged in status.
	 */
	canActivate(): boolean {
		if (this._authService.isLoggedIn()) {
			return true
		} else {
			localStorage.removeItem('email');
			this.router.navigate(['/login']);
			return false
		}
	}
}
