import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment.development';
import { ILogin, IToken } from '../interfaces/i-login';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  baseUrl: string = environment.baseUrl;
  keyToken: string = "KEYTOKEN";

  constructor(private http: HttpClient, private router: Router) {}

  login(user: ILogin): Observable<IToken> {
    const headers = {
      'Content-Type': 'application/json'
    };
  
    const body= JSON.stringify(user);
  
    return this.http.post<IToken>(`${this.baseUrl}/api/auth/login`, body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          Swal.fire({
            title: 'Error!',
            text: error.error.message,
            icon: 'error',
          });
          return throwError(new Error("Something went wrong"));
        })
      );
  }

  setAuthentication(token: any) {
    console.log("Token to be saved:", token.token);
    localStorage.setItem(this.keyToken, token.token);
    this.isLoggedIn = true;
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem(this.keyToken)) {
      this.isLoggedIn = true;
      return this.isLoggedIn;
    }

    return false;
  }

  checkUserRole(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/auth/check-role`, { responseType: 'text' });
  }

  getToken(): string {
    return localStorage.getItem(this.keyToken) || ""
  }

  redirectBasedOnRole() {
    this.checkUserRole().subscribe(role => {
      if (role == '"ADMIN"') {
        this.router.navigate(['/admin/lapangan']);
      } else {
        localStorage.removeItem(this.keyToken);
        this.isLoggedIn = false;
        this.router.navigate(['/download']);
      }
    });
  }
  
}