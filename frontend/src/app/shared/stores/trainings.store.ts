import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { Http } from '../services/http.service';
import { HttpHeaders } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { CreatedTrainingData, Training, TrainingData } from '../models/training';
import { Exercise } from '../models/exercise';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TrainingStore {
  private route: string = 'trainings';
  private trainingSubject = new BehaviorSubject<Training[]>([]);

  trainings$: Observable<Training[]> = this.trainingSubject.asObservable();

  createdTrainingId: number = 0;

  constructor(private http: Http, private loadingService: LoadingService, private router: Router) {
    this.loadAllTrainings();
  }

  public loadAllTrainings() {
    const loadTrainings$ = this.http
      .get<TrainingData>(`${this.route}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        }),
      })
      .pipe(
        catchError((err) => {
          const message = 'Could not load trainings';
          alert(message);
          return throwError(() => err);
        }),
        tap((res: TrainingData) => this.trainingSubject.next(res.data.trainings))
      );

    this.loadingService.showLoaderUntilCompleted(loadTrainings$).subscribe();
  }

  getTrainings(): Observable<Training[]> {
    return this.trainings$;
  }

  addTraining(newTraining: Training, exercisesAdded: Exercise[]): void {
    const addTrain$ = this.http
      .post<Training, any>(`${this.route}`, newTraining, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        }),
      })
      .pipe(
        catchError((err) => {
          alert('Error adding training');
          return throwError(() => err);
        }),
        tap((createdTraining: CreatedTrainingData) => {
          const newTraining = createdTraining.data;
          const currentTrainings = this.trainingSubject.getValue();
          this.trainingSubject.next([...currentTrainings, newTraining]);
          this.createdTrainingId = newTraining.id;
        }),
        switchMap(() => {
          if (exercisesAdded && exercisesAdded.length > 0) {
            return this.sendExercisesToTraining(exercisesAdded);
          }
          return [];
        }),
        tap(() => {
          this.loadAllTrainings();
        })
      );

    this.loadingService.showLoaderUntilCompleted(addTrain$)
      .subscribe({
        next: () => {
          this.router.navigateByUrl(`trainings/${this.createdTrainingId}`);
        },
        error: (err) => {
          console.error('An error occurred:', err);
        },
      });
  }


  sendExercisesToTraining(exerciseAdded: Exercise[]): Observable<unknown> {
    const exercises = exerciseAdded.map((exercise) => ({
      id: exercise.id,
      series: 3,
      repetitions: "12",
      rest: 30,
    }));

    const payload = { exercises };

    return this.http
      .post(`trainings/${this.createdTrainingId}/exercises`, payload, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        }),
      })
      .pipe(
        catchError((err) => {
          console.error('Error sending exercises:', err);
          alert('Não foi possível enviar os exercícios');
          return throwError(() => err);
        })
      )
  }



  removeTraining(trainingId: number): void {
    this.http
      .delete(`${this.route}/${trainingId}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        }),
      })
      .pipe(
        catchError((err) => {
          alert('Error removing training');
          return throwError(() => err);
        }),
        tap(() => {
          const currentTrainings = this.trainingSubject.getValue();
          const updatedTrainings = currentTrainings.filter(
            (training) => training.id !== trainingId
          );
          this.trainingSubject.next(updatedTrainings);
        })
      )
      .subscribe();
  }
}
