import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom, map, of, switchMap, combineLatest, Observable, BehaviorSubject, take, tap, filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { CardExerciseComponent } from '../../components/card-exercise/card-exercise.component';
import { UserCardExerciseComponent } from '../../components/user-card-exercise/user-card-exercise.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Exercise } from '../../models/exercise.model';
import { ButtonComponent } from '../../components/button/button.component';
import Swal from 'sweetalert2';
import { TrainingTimerService } from './services/training-timer.service';
import { TrainingStateService } from './services/training-state.service';
import { ExerciseViewActions } from '../../../store/exercise-view/action.types';
import { ExerciseViewService } from '../exercise-view/services/exercise-view.service';
import { Training } from '../../models/training.model';
import { formatDuration } from '../../utils/helpers/duration.helper';
import { AppState } from '../../../store';
import { TrainingViewEntityService } from '../../../store/training-view/training-view-entity.service';
import { UserEntityService } from '../../../store/user/user-entity.service';




@Component({
  selector: 'app-training-view',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    CardExerciseComponent,
    UserCardExerciseComponent,
    ButtonComponent
  ],
  templateUrl: './training-view.component.html',
  styleUrls: ['./training-view.component.scss'],
})
export class TrainingViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store<AppState>);
  private readonly timerService = inject(TrainingTimerService);
  private readonly trainingStateService = inject(TrainingStateService);
  private readonly exerciseViewService = inject(ExerciseViewService);
  private readonly trainingBehaviorSubject = new BehaviorSubject<Training | null>(null);
  private readonly trainingViewEntityService = inject(TrainingViewEntityService);
  private readonly userService = inject(UserEntityService);

  isAdmin = this.userService.getIsAdmin();

  training$ = this.trainingBehaviorSubject.asObservable();
  isTrainingStarted$ = this.trainingStateService.isTrainingStarted$;
  isPaused$ = this.trainingStateService.isTrainingPaused$;
  elapsedTime$ = this.timerService.elapsedTime$;
  isTrainingCompleted$ = this.training$.pipe(
    map(training => training?.completed ?? false)
  );

  showTimer$ = combineLatest([
    this.isTrainingCompleted$,
    this.trainingStateService.isTrainingStarted$
  ]).pipe(
    map(([isCompleted, isStarted]) => !isCompleted && isStarted)
  );

  isOtherTrainingActive$ = this.training$.pipe(
    switchMap(training =>
      training ? combineLatest([
        this.trainingStateService.isTrainingStarted$,
        this.trainingStateService.activeTrainingId$
      ]).pipe(
        map(([isStarted, activeId]) =>
          isStarted && activeId !== null && activeId !== training.id
        )
      ) : of(false)
    )
  );

  showTrainingTime$ = combineLatest([
    this.isTrainingStarted$,
    this.training$,
    this.trainingStateService.activeTrainingId$
  ]).pipe(
    map(([isStarted, training, activeId]) =>
      isStarted && training && training.id === activeId
    )
  );

  formatDuration = formatDuration;

  ngOnInit(): void {
    const trainingId = Number(this.route.snapshot.paramMap.get('id'));
    this.trainingViewEntityService.trainingView$.pipe(
      map(userTrainings => userTrainings.find((training: Training) =>
        'origin_trainingID' in training ? training.origin_trainingID === trainingId : training.id === trainingId
      )!)
    ).subscribe(training => {
      this.trainingBehaviorSubject.next(training);
    });
  }

  getTraining(): Training {
    return this.trainingBehaviorSubject.value!;
  }

  hasUserTraining(exercises: Exercise[]): boolean {
    if (!exercises?.length) return false;
    return exercises.some(exercise => exercise.user_trainingID !== null && exercise.user_trainingID !== undefined);
  }

  isAllExercisesCompleted(): Observable<boolean> {
    const training = this.getTraining();
    if (!training?.exercises?.length) return of(false);

    return combineLatest(
      training.exercises.map(exercise =>
        this.exerciseViewService.areAllSeriesCompleted(exercise.id)
      )
    ).pipe(
      map(completedStates => completedStates.every(state => state))
    );
  }

  isCompleted(exerciseId: number) {
    return this.exerciseViewService.areAllSeriesCompleted(exerciseId);
  }

  onExerciseCompleted(exercise: Exercise) {
    this.exerciseViewService.areAllSeriesCompleted(exercise.id)
      .pipe(take(1))
      .subscribe(isCompleted => {
        if (isCompleted) {
          this.exerciseViewService.uncompleteSeries(exercise.id);
        } else {
          this.exerciseViewService.completeAllSeries(exercise.id, exercise.series);
        }
      });
  }

  async onExerciseClick(exercise: Exercise): Promise<void> {
    if ((await firstValueFrom(this.isOtherTrainingActive$)) === true) return;
    this.store.dispatch(ExerciseViewActions.setExercises({
      exercises: (this.getTraining().exercises || this.getTraining().training_exercises),
      selectedExerciseId: exercise.id,
      source: 'user-training'
    }));

    this.router.navigate(['/general/exercise-view']);
  }

  async onTrainingStart() {
    const training = await firstValueFrom(this.training$);
    if (!training) return;

    this.store.dispatch(ExerciseViewActions.setExercises({
      exercises: training.exercises,
      selectedExerciseId: training.exercises[0]?.id || 0,
      source: 'user-training'
    }));

    this.trainingStateService.startTraining(training.id);
    this.timerService.startTraining();
  }

  onTrainingPause() {
    this.trainingStateService.pauseTraining();
    this.timerService.pauseTraining();
  }

  onTrainingResume() {
    this.trainingStateService.resumeTraining();
    this.timerService.resumeTraining();
  }

  onTrainingRestart() {
    Swal.fire({
      title: 'Reiniciar treino?',
      text: 'Isso irá zerar o tempo e os exercícios completados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, reiniciar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f0ad4e',
      cancelButtonColor: '#6c757d'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const training = await firstValueFrom(this.training$);
        if (!training) return;

        training.exercises.forEach((exercise: Exercise) => {
          this.exerciseViewService.uncompleteSeries(exercise.id);
        });

        this.trainingStateService.resetTraining();
        this.timerService.stopTraining();
      }
    });
  }

  async onTrainingComplete() {
    const training = await firstValueFrom(this.training$);
    if (!training) return;

    this.store.dispatch(ExerciseViewActions.completeTraining({ trainingId: training.id }));
  }

  onTogglePause() {
    firstValueFrom(this.isPaused$).then(isPaused => {
      isPaused ? this.onTrainingResume() : this.onTrainingPause();
    });
  }
}
