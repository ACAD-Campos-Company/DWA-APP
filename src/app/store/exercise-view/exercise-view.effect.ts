import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ExerciseService } from "../../shared/services/exercise.service";
import { ExerciseViewActions } from "./action.types";
import { concatMap, map, withLatestFrom, EMPTY, mergeMap } from "rxjs";
import { Store } from "@ngrx/store";
import { selectExerciseViewState } from "./exercise-view.selectors";
import { from } from "rxjs";
import { TrainingService } from "../../shared/services/training.service";
import { TrainingStateService } from "../../shared/pages/training-view/services/training-state.service";

@Injectable()
export class ExerciseViewEffects {
  private readonly exerciseService = inject(ExerciseService);
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly trainingService = inject(TrainingService);
  private readonly trainingStateService = inject(TrainingStateService);

  updateRepetitionWeight$ = createEffect(() => this.actions$.pipe(
    ofType(ExerciseViewActions.updateRepetitionWeight),
    withLatestFrom(this.store.select(selectExerciseViewState)),
    concatMap(([{ userExerciseId, weight, repetitionId }, state]) => {
      if (!repetitionId) return EMPTY;

      return this.exerciseService.updateRepetitionWeight(userExerciseId, weight, repetitionId).pipe(
        map((response) => {
          // Update the state immediately
          const updatedExercises = state.exercises.map(exercise => {
            const hasRepetition = exercise.repetitions.some(rep => rep.id === repetitionId);
            
            if (!hasRepetition) return exercise;
            
            return {
              ...exercise,
              repetitions: exercise.repetitions.map(rep => 
                rep.id === repetitionId ? { ...rep, weight } : rep
              )
            };
          });

          // Dispatch both the success action and update the state
          return ExerciseViewActions.updateRepetitionWeightSuccess({
            userExerciseId,
            weight,
            repetitionId,
            updatedRepetition: response.data,
            updatedExercises
          });
        })
      );
    })
  ));

  completeTraining$ = createEffect(() => this.actions$.pipe(
    ofType(ExerciseViewActions.completeTraining),
    mergeMap(({ trainingId }) =>
      from(this.trainingService.completeTrainingWithFeedback(trainingId)).pipe(
        map(success => {
          if (success) {
            this.trainingStateService.completeTraining();
            return ExerciseViewActions.completeTrainingSuccess({ training: success.training! });
          }
          return ExerciseViewActions.completeTrainingFailure();
        })
      )
    )
  ));
}
