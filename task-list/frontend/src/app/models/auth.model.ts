// Unified response model
export interface AuthResponse {
  errorCode?: number;
  message?: string;

  success?: boolean;
  id?: string;
  email?: string;
  name?: string;
}

export const AUTH_RESPONSE_DEFAULT: AuthResponse = {
  errorCode: 20,
  message: '',
};
