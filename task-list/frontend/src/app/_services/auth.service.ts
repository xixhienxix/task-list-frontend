import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment'
import { catchError, map, throwError } from "rxjs";
import { AuthResponse } from "../models/auth.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private httpClient: HttpClient) { }


    postLogin(email: string) {
        const url = environment.backendURL;
        return this.httpClient.post<AuthResponse>(url + "/login", { email }).pipe(
            catchError((error) => {
                console.error("Error de Inicio de Session:", error);
                return throwError(() => error); 
            })
        );
    }

    signUp(email: string) {
        const url = environment.backendURL;
        return this.httpClient.post<AuthResponse>(url + "/register", { email }).pipe(
            catchError((error) => {
                console.error("Error de Registro:", error);
                return throwError(() => error);
            })
        );
    }

    isLoggedIn(): boolean {
		const token = localStorage.getItem('email');
		return !!token;
	}

}
