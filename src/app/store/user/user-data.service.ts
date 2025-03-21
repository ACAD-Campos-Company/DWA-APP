import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';
import { User, UserData } from '../../shared/models/users.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Update } from '@ngrx/entity';
import { environment } from '../../environments/environment';

@Injectable()
export class UserDataService extends DefaultDataService<User> {
  private readonly baseUrl = `${environment.api}users`;

  constructor(protected override http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Users', http, httpUrlGenerator);
  }

  override getAll(): Observable<User[]> {
    return this.http.get<UserData>(this.baseUrl).pipe(
      map(response => response.data.users)
    );
  }

  override update(update: Update<User>): Observable<User> {
    const { id, ...changes } = update.changes;
    return this.http.put<any>(`${this.baseUrl}/${update.id}`, changes).pipe(
      map(response => response.data)
    );
  }

  sendTokenStorage(device_token: string, device_os: string) {
    return this.http.post<any>(`${this.baseUrl}/device-token`, { device_token, device_os });
  }
} 