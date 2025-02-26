import { Injectable } from '@angular/core';
import { Training, TrainingData, UserTrainingData } from '../../shared/models/training.model';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingDataService extends DefaultDataService<Training> {
  private readonly routes = {
    userTraining: `${environment.api}user-training/user`,
    completeTraining: `${environment.api}user-training`,
    trainings: `${environment.api}trainings?withExercises=true`,
    trainingByUserId: `${environment.api}user-training/user`
  } as const;

  constructor(protected override http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Trainings', http, httpUrlGenerator);
  }

  completeTraining(trainingId: number, duration: string): Observable<TrainingData> {
    return this.http.post<TrainingData>(`${this.routes.completeTraining}/${trainingId}/complete`, { duration });
  }

  override getAll(): Observable<Training[]> {
    return this.http.get<TrainingData>(this.routes.trainings).pipe(
      map((response: TrainingData) => response.data.trainings)
    );
  }

  getUserTrainings(userId: number): Observable<Training[]> {
    return this.http.get<UserTrainingData>(`${this.routes.userTraining}/${userId}`).pipe(
      map((response: UserTrainingData) => response.data)
    );
  }
}
