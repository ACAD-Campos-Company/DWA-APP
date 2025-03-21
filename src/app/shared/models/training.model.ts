import { Exercise } from "./exercise.model";
import { GenericData, GenericListResult } from "./generic-data.model";


export interface TrainingData extends GenericData {
  data: Data
}

export interface UserTrainingData extends GenericData {
  data: Training[];
}

export interface Data extends GenericListResult {
  trainings: Training[]
}

export interface Training {
  id: number,
  name: string,
  expire_date: string,
  description: string,
  category: string,
  duration: number,
  todayTraining: boolean,
  exercises: Exercise[],
  training_exercises: Exercise[],
  completed: boolean,
  last_duration: string,
  origin_trainingID?: number,
  user_id?: number
}

export interface CreatedTrainingData extends GenericData {
  data: Training;
}
