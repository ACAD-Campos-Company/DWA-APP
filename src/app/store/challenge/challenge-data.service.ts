import { Injectable } from '@angular/core';
import { Challenge, completeChallengeData, todayChallengeData } from '../../shared/models/challenge.model';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChallengeData } from '../../shared/models/challenge.model';

@Injectable({
  providedIn: 'root'
})
export class ChallengeDataService extends DefaultDataService<Challenge> {
  private readonly routes = {
    challenges: `${environment.api}challenges`,
    todayChallenges: `${environment.api}challenges/today`,
    userChallenges: `${environment.api}user-challenges`
  } as const;

  constructor(protected override http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Challenges', http, httpUrlGenerator);
  }

  override getAll(): Observable<Challenge[]> {
    return this.http.get<ChallengeData>(this.routes.challenges).pipe(
      map((response: ChallengeData) => response.data.challenges)
    );
  }

  getTodayChallenges(): Observable<Challenge[]> {
    return this.http.get<todayChallengeData>(this.routes.todayChallenges).pipe(
      map((response: todayChallengeData) => response.data)
    );
  }

  completeChallenge(payload: { challenge_id: number, user_id: number }): Observable<Challenge> {
    return this.http.post<completeChallengeData>(this.routes.userChallenges, payload).pipe(
      map((response: completeChallengeData) => response.data)
    );
  }
} 