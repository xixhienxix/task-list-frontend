/**
 * Represents the standard response model returned by authentication endpoints.
 *
 * This interface is used to unify server responses from both login and registration
 * endpoints, ensuring consistent handling across the application.
 *
 * @example
 * ```ts
 * this.authService.postLogin(email).subscribe({
 *   next: (res: AuthResponse) => {
 *     if (res.success) {
 *       console.log(`User ${res.email} logged in successfully`);
 *     }
 *   },
 *   error: (err) => console.error('Login error:', err)
 * });
 * ```
 */
export interface AuthResponse {
  /**
   * Optional numeric error code returned by the backend.
   * Used to identify specific authentication errors.
   *
   * @example 401 — Invalid credentials
   */
  errorCode?: number;

  /**
   * Human-readable message providing additional information
   * about the response (success or failure).
   *
   * @example "User registered successfully"
   */
  message?: string;

  /**
   * Indicates whether the request was successful.
   *
   * @example true
   */
  success?: boolean;

  /**
   * Unique identifier assigned to the authenticated user.
   */
  id?: string;

  /**
   * Email address associated with the authenticated account.
   */
  email?: string;

  /**
   * Full name of the authenticated user, if available.
   */
  name?: string;
}

/**
 * Default fallback object for `AuthResponse` to ensure type safety
 * and avoid null or undefined reference errors.
 */
export const AUTH_RESPONSE_DEFAULT: AuthResponse = {
  errorCode: 20,
  message: '',
};
