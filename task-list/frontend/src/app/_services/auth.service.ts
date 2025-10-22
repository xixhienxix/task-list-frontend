import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { catchError, throwError } from "rxjs";
import { AuthResponse } from "../models/auth.model";

/**
 * Service responsible for handling authentication-related API calls.
 *
 * This service manages user login, registration, and authentication state
 * by communicating with the backend through HTTP requests.
 *
 * @example
 * ```ts
 * constructor(private authService: AuthService) {}
 *
 * login() {
 *   this.authService.postLogin('user@example.com').subscribe({
 *     next: res => console.log('Login successful:', res),
 *     error: err => console.error('Login failed:', err)
 *   });
 * }
 * ```
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    /**
     * Creates an instance of `AuthService`.
     * @param httpClient Angular's `HttpClient` used for making API requests.
     */
    constructor(private httpClient: HttpClient) { }

    /**
     * Sends a login request to the backend API.
     *
     * @param email - The user's email address.
     * @returns An observable that emits an `AuthResponse` upon success.
     *
     * @remarks
     * - Handles HTTP errors gracefully using `catchError`.
     * - The backend endpoint is defined in `environment.backendURL`.
     */
    postLogin(email: string) {
        const url = environment.backendURL;
        return this.httpClient.post<AuthResponse>(`${url}/login`, { email }).pipe(
            catchError((error) => {
                console.error("Error de Inicio de Sesión:", error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Sends a registration request to the backend API.
     *
     * @param email - The user's email address.
     * @returns An observable that emits an `AuthResponse` upon successful registration.
     *
     * @remarks
     * - Handles errors with `catchError` to ensure observables do not break.
     */
    signUp(email: string) {
        const url = environment.backendURL;
        return this.httpClient.post<AuthResponse>(`${url}/register`, { email }).pipe(
            catchError((error) => {
                console.error("Error de Registro:", error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Checks whether a user is currently logged in.
     *
     * @returns `true` if a valid session token (email) exists in localStorage, otherwise `false`.
     *
     * @example
     * ```ts
     * if (this.authService.isLoggedIn()) {
     *   console.log('User is logged in');
     * }
     * ```
     */
    isLoggedIn(): boolean {
        const token = localStorage.getItem('email');
        return !!token;
    }
}