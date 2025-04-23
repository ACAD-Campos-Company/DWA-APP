import { createAction, props } from '@ngrx/store';
import { Exercise } from '../../shared/models/exercise.model';
import { Training } from '../../shared/models/training.model';

export const setExercises = createAction(
  '[Exercise View] Set Exercises',
  props<{ 
    exercises: Exercise[], 
    selectedExerciseId: number,
    source: 'training' | 'user-training' | 'all' 
  }>()
);
export const nextExercise = createAction('[Exercise View] Next Exercise');
export const previousExercise = createAction('[Exercise View] Previous Exercise');

export const completeSeries = createAction(
  '[Exercise View] Complete Series',
  props<{ exerciseId: number; seriesIndex: number }>()
);
export const uncompleteSeries = createAction(
  '[Exercise View] Uncomplete Series',
  props<{ exerciseId: number }>()
);
export const setCurrentSeries = createAction(
  '[Exercise View] Set Current Series',
  props<{ exerciseId: number; seriesIndex: number }>()
);

export const updateRepetitionWeight = createAction(
  '[Exercise View] Update Repetition Weight',
  props<{ 
    userExerciseId: number;
    weight: number;
    repetitionId: number;
  }>()
);
export const updateRepetitionWeightSuccess = createAction(
  '[Exercise View] Update Repetition Weight Success',
  props<{ 
    userExerciseId: number; 
    weight: number; 
    repetitionId: number; 
    updatedRepetition: any;
    updatedExercises: any[];
  }>()
);

export const completeExercise = createAction(
  '[Exercise View] Complete Exercise',
  props<{ exerciseId: number }>()
);

export const completeTraining = createAction(
  '[Exercise View] Complete Training',
  props<{ trainingId: number }>()
);
export const completeTrainingSuccess = createAction(
  '[Exercise View] Complete Training Success',
  props<{ training: Training }>()
);
export const completeTrainingFailure = createAction(
  '[Exercise View] Complete Training Failure'
);

export const resetExerciseView = createAction('[Exercise View] Reset');
export const resetExerciseState = createAction('[Exercise View] Reset Exercise State');
