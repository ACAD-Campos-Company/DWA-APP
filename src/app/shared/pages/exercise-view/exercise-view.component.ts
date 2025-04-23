import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { ButtonComponent } from '../../components/button/button.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import * as ExerciseViewActions from '../../../store/exercise-view/exercise-view.actions';
import {
  selectCurrentExercise,
  selectHasNextExercise,
  selectHasPreviousExercise,
  selectIsTrainingView,
  selectCompletedSeries,
} from '../../../store/exercise-view/exercise-view.selectors';
import { Exercise, Repetition } from '../../models/exercise.model';
import { firstValueFrom, map, Observable, combineLatest} from 'rxjs';
import { ExerciseViewService } from './services/exercise-view.service';
import { RestTimerService } from '../training-view/services/rest-timer.service';
import { TrainingStateService } from '../training-view/services/training-state.service';
import { FormsModule } from '@angular/forms';
import { UserEntityService } from '../../../store/user/user-entity.service';
import { ExerciseService } from '../../services/exercise.service';

@Component({
  selector: 'app-exercise-view',
  standalone: true,
  imports: [
    HeaderComponent,
    ButtonComponent,
    RouterModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './exercise-view.component.html',
  styleUrls: ['./exercise-view.component.scss'],
})
export class ExerciseViewComponent {
  private readonly store = inject(Store<AppState>);
  private readonly trainingStateService = inject(TrainingStateService);
  private readonly userService = inject(UserEntityService);

  public readonly exerciseViewService = inject(ExerciseViewService);
  public readonly restTimer = inject(RestTimerService);

  exercise$ = this.store.select(selectCurrentExercise);
  hasNextExercise$ = this.store.select(selectHasNextExercise);
  hasPreviousExercise$ = this.store.select(selectHasPreviousExercise);
  isTrainingView$ = this.store.select(selectIsTrainingView);
  currentSeries$ = this.exerciseViewService.getCurrentSeries();
  isTrainingStarted$ = this.trainingStateService.isTrainingStarted$;
  isTrainingCompleted$ = this.trainingStateService.isTrainingCompleted$;
  isTrainingPaused$ = this.trainingStateService.isTrainingPaused$;

  isEditingWeight = false;
  editWeight: number | null = null;
  currentEditingSeriesIndex: number | null = null;
  isAdmin = this.userService.getIsAdmin();

  isExerciseCompleted$ = combineLatest([
    this.store.select(selectCompletedSeries),
    this.exercise$
  ]).pipe(
    map(([completedSeries, exercise]) => {
      if (!exercise || !completedSeries) return false;
      
      const exerciseCompletedSeries = completedSeries[exercise.id] ?? [];
      
      if (!Array.isArray(exerciseCompletedSeries)) return false;
      
      return Array.from({ length: exercise.series }, (_, i) => i)
        .every(seriesIndex => exerciseCompletedSeries.includes(seriesIndex));
    })
  );

  hasMethodology(exercise: Exercise | null): boolean {
    return !!exercise?.methodology;
  }

  startRestTimer(seconds: number) {
    this.restTimer.startTimer(seconds);
  }

  async onCompleteSeries(seriesIndex: number) {
    const exercise = await firstValueFrom(this.exercise$);
    const isCompleted = await firstValueFrom(this.isExerciseCompleted$);

    if (!isCompleted) {
      this.exerciseViewService.completeSeries(exercise.id, seriesIndex);

      if (seriesIndex === exercise.series - 1) {
        const allPreviousCompleted = await firstValueFrom(
          this.exerciseViewService.areAllPreviousExercisesCompleted(exercise.id)
        );
        
        if (allPreviousCompleted) {
          const allExercisesCompleted = await firstValueFrom(
            this.exerciseViewService.areAllExercisesInTrainingCompleted()
          );

          if (allExercisesCompleted) {
            this.store.dispatch(ExerciseViewActions.completeTraining({ trainingId: exercise.user_trainingID! }));
          } else {
            this.navigateToExercise('next');
          }
        }
      } else {
        this.exerciseViewService.setCurrentSeries(exercise.id, seriesIndex + 1);
      }
    }
  }

  isLastSeries(exercise: Exercise | null, seriesIndex: number): boolean {
    return seriesIndex === (exercise?.series || 0) - 1;
  }

  navigateToExercise(direction: 'next' | 'previous'): void {
    this.store.dispatch(
      direction === 'next' 
        ? ExerciseViewActions.nextExercise()
        : ExerciseViewActions.previousExercise()
    );
  }

  createSeriesArray(series: number): number[] {
    return Array(series).fill(0).map((_, i) => i);
  }

  getRepetitionForSeries(repetitions: Repetition[], seriesIndex: number): number {
    if (!repetitions || repetitions.length === 0) return 0;
    if (repetitions.length === 1) return repetitions[0].repetitions;
    return repetitions[seriesIndex]?.repetitions || repetitions[repetitions.length - 1].repetitions;
  }
  
  isButtonDisabled(seriesIndex: number): Observable<boolean> {
    return combineLatest([
      this.isTrainingStarted$,
      this.isTrainingPaused$,
      this.exerciseViewService.isSeriesCompleted(seriesIndex),
      this.isTrainingCompleted$,
    ]).pipe(
      map(([isStarted, isPaused, isSeriesCompleted, isTrainingCompleted]) => 
        !isStarted || isPaused || isTrainingCompleted || isSeriesCompleted
      )
    );
  }

  async startWeightEdit(seriesIndex: number) {
    const exercise = await firstValueFrom(this.exercise$);
    if (!exercise) return;

    this.isEditingWeight = true;
    this.currentEditingSeriesIndex = seriesIndex;
    this.editWeight = this.getWeightForSeries(exercise.repetitions, seriesIndex);
  }

  async confirmWeightEdit() {
    const exercise = await firstValueFrom(this.exercise$);
    if (!exercise || this.editWeight === null || this.currentEditingSeriesIndex === null) return;

    const repetition = exercise.repetitions[this.currentEditingSeriesIndex];
    if (!repetition) return;
    
    const updatedRepetitions = [...exercise.repetitions];
    updatedRepetitions[this.currentEditingSeriesIndex] = {
      ...repetition,
      weight: this.editWeight
    };
    
    this.exerciseViewService.updateRepetitionWeight(
      repetition.training_exerciseID,
      this.editWeight,
      repetition.id
    );

    this.isEditingWeight = false;
    this.editWeight = null;
    this.currentEditingSeriesIndex = null;
  }

  getWeightForSeries(repetitions: Repetition[], seriesIndex: number): number | null {
    if (!repetitions || !repetitions[seriesIndex]) return null;
  
    return repetitions[seriesIndex]?.weight || null;
  }
}
