import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { User, UserData } from '../models/users';
import { Http } from '../services/http.service';
import { HttpHeaders } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { Training, TrainingData } from '../models/training';
import { Exercise, ExerciseData } from '../models/exercise';

@Injectable({
  providedIn: 'root'
})
export class ExercisesStore {
  private route: string = 'exercises';
  private userSubject = new BehaviorSubject<Exercise[]>([]);

  exercises$: Observable<Exercise[]> = this.userSubject.asObservable();

  constructor(private http: Http, private loadingService: LoadingService) {
    this.loadAllExercises();
   }

  public loadAllExercises() {
    const loadTrainings$ = this.http.get<ExerciseData>(`${this.route}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      }),
    })
      .pipe(
        catchError((err) => {
          const message = "Could not load exercises";
          alert(message);
          return throwError(() => err);
        }),
        tap((res: ExerciseData) => this.userSubject.next(res.data.exercises))
      );

    this.loadingService.showLoaderUntilCompleted(loadTrainings$).subscribe();
  }

  getExercises(): Observable<Exercise[]> {
    return this.exercises$;
  }
}
