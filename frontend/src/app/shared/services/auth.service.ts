import { Injectable } from '@angular/core';
import { Http } from './http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticateLogin, ForgotPasswordRes } from '../models/authenticate';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private routeLogin: string = 'auth/login';

  private routeResetPasswordStep1: string = 'auth/forgot-password-step1';
  private routeResetPasswordStep2: string = 'auth/forgot-password-step2';
  private routeResetLastStep: string = 'auth/reset-password';

  private authStateSubject = new BehaviorSubject<boolean>(false);
  authState$ = this.authStateSubject.asObservable();

  constructor(private http: Http) { }

  authenticate(auth: FormGroup): Observable<AuthenticateLogin> {
    return this.http.post(`${this.routeLogin}`, auth);
  }

  resetPasswordStep1(document: string): Observable<ForgotPasswordRes> {
    return this.http.post(`${this.routeResetPasswordStep1}`, document);
  }

  resetPasswordStep2(payload: { document: string; telephone: number }): Observable<ForgotPasswordRes> {
    return this.http.post(`${this.routeResetPasswordStep2}`, payload);
  }

  resetPasswordLastStep(payload: { password: string, confirm_password: string, token: string, id: number }): Observable<ForgotPasswordRes> {
    return this.http.post(`${this.routeResetLastStep}`, payload);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  login(): void {
    this.authStateSubject.next(true);
  }

  logout(): void {
    this.authStateSubject.next(false);
  }
}
