import { createReducer, on } from '@ngrx/store';
import * as ExerciseViewActions from './exercise-view.actions';
import { ExerciseViewState, initialState } from './exercise-view.state';
import { Exercise, Repetition } from '../../shared/models/exercise.model';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export const adapter: EntityAdapter<Exercise> = createEntityAdapter<Exercise>();
export const repetitionsAdapter: EntityAdapter<Repetition> = createEntityAdapter<Repetition>();

export const initialExerciseViewState: ExerciseViewState = adapter.getInitialState({
  exercises: [],
  currentIndex: 0,
  selectedExerciseId: null,
  source: 'all',
  completedSeries: {},
  currentSeries: {}
});

export const { selectAll } = adapter.getSelectors();

export const exerciseViewReducer = createReducer(
  initialExerciseViewState,
  on(ExerciseViewActions.resetExerciseView, () => initialState),
  on(ExerciseViewActions.resetExerciseState, (state) => ({
    ...initialExerciseViewState
  })),
  on(ExerciseViewActions.setExercises, (state, { exercises, selectedExerciseId, source }) => {
    const updatedExercises = exercises.map(newExercise => {
      const existingExercise = state.exercises.find(e => e.id === newExercise.id);
      
      if (!existingExercise) {
        return newExercise;
      }
      
      const updatedRepetitions = newExercise.repetitions.map(newRep => {
        const existingRep = existingExercise.repetitions.find(r => r.id === newRep.id);
        return existingRep ? { ...newRep, weight: existingRep.weight } : newRep;
      });
      
      return {
        ...newExercise,
        repetitions: updatedRepetitions
      };
    });
    
    const currentIndex = updatedExercises.findIndex(ex => ex.id === selectedExerciseId);
    return {
      ...state,
      exercises: updatedExercises,
      selectedExerciseId,
      source,
      currentIndex: currentIndex >= 0 ? currentIndex : 0,
      completedSeries: {
        ...state.completedSeries
      },
      currentSeries: {}
    };
  }),
  on(ExerciseViewActions.nextExercise, (state) => ({
    ...state,
    currentIndex: Math.min(state.currentIndex + 1, state.exercises.length - 1),
    selectedExerciseId: state.exercises[Math.min(state.currentIndex + 1, state.exercises.length - 1)]?.id || null
  })),
  on(ExerciseViewActions.previousExercise, (state) => ({
    ...state,
    currentIndex: Math.max(state.currentIndex - 1, 0),
    selectedExerciseId: state.exercises[Math.max(state.currentIndex - 1, 0)]?.id || null
  })),
  on(ExerciseViewActions.completeSeries, (state, { exerciseId, seriesIndex }) => ({
    ...state,
    completedSeries: {
      ...state.completedSeries,
      [exerciseId]: [...(state.completedSeries[exerciseId] || []), seriesIndex]
    }
  })),
  on(ExerciseViewActions.uncompleteSeries, (state, { exerciseId }) => ({
    ...state,
    completedSeries: {
      ...state.completedSeries,
      [exerciseId]: []
    }
  })),
  on(ExerciseViewActions.setCurrentSeries, (state, { exerciseId, seriesIndex }) => ({
    ...state,
    currentSeries: {
      ...state.currentSeries,
      [exerciseId]: seriesIndex
    }
  })),
  on(ExerciseViewActions.updateRepetitionWeight, (state, { userExerciseId, weight, repetitionId }) => ({
    ...state,
    exercises: state.exercises.map(exercise => {
      const hasRepetition = exercise.repetitions.some(rep => rep.id === repetitionId);
      
      if (!hasRepetition) return exercise;

      return {
        ...exercise,
        repetitions: exercise.repetitions.map(rep => 
          rep.id === repetitionId ? { ...rep, weight } : rep
        )
      };
    })
  })),
  on(ExerciseViewActions.updateRepetitionWeightSuccess, (state, { updatedRepetition, repetitionId, weight }) => {
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

    return {
      ...state,
      exercises: updatedExercises
    };
  })
);
