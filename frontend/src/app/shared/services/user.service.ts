import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from './http.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private routeLogin: string = 'users';

  constructor(private http: Http) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }

  updateUser(
    payload: { password: string; confirm_password: string },
    id: string
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.routeLogin}/${id}`, payload, { headers });
  }
}
