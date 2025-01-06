import { Exercise } from "./exercise";
import { GenericData, GenericListResult } from "./generic-data";


export interface TrainingData extends GenericData {
  data: Data
}

export interface Data extends GenericListResult {
  trainings: Training[]
}

export interface Training {
  id: number,
  name: string,
  description: string,
  category: string,
  duration: number,
  exercises: Exercise[]
}

export interface CreatedTrainingData extends GenericData {
  data: Training;
}
