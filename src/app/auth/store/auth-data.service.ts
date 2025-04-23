import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticateLogin, AuthenticateLoginData, ForgotPasswordRes } from '../../shared/models/authenticate.model';


@Injectable({
  providedIn: 'root'
})
export class AuthDataService extends DefaultDataService<AuthenticateLoginData> {
  private readonly baseUrl = 'https://campos-portfolio.net/api';

  constructor(
    protected override http: HttpClient, 
    httpUrlGenerator: HttpUrlGenerator,
  ) {
    super('Auth', http, httpUrlGenerator);
  }

  override getAll(): Observable<AuthenticateLoginData[]> {
    return this.http.get<any>(`${this.baseUrl}/auth`).pipe(
      map(response => response.user)
    );
  }

  authenticate(credentials: { document: string; password: string, fromApp: boolean }): Observable<AuthenticateLogin> {
    return this.http.post<AuthenticateLogin>(`${this.baseUrl}/auth/login`, credentials);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, {});
  }

  resetPasswordStep1(document: string): Observable<ForgotPasswordRes> {
    return this.http.post<ForgotPasswordRes>(`${this.baseUrl}/auth/forgot-password-step1`, { document });
  }

  resetPasswordStep2(payload: { code: string; userID: number }): Observable<ForgotPasswordRes> {
    return this.http.post<ForgotPasswordRes>(`${this.baseUrl}/auth/forgot-password-step2`, payload);
  }

  resetPasswordLastStep(payload: {
    password: string;
    confirm_password: string;
    token: string;
    id: number;
  }): Observable<ForgotPasswordRes> {
    return this.http.post<ForgotPasswordRes>(`${this.baseUrl}/auth/reset-password`, payload);
  }
} 