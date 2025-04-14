import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise, Repetition } from '../../models/exercise.model';
import { Router, RouterModule } from '@angular/router';
import { ExerciseViewActions } from '../../../store/exercise-view/action.types';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-card-exercise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-exercise.component.html',
  styleUrls: ['./card-exercise.component.scss']
})
export class CardExerciseComponent {
  @Input() exercise!: Exercise;
  @Output() exerciseClicked = new EventEmitter<Exercise>();

  private readonly store = inject(Store<AppState>);
  private readonly router = inject(Router);

  onExerciseClick(): void {
    this.exerciseClicked.emit(this.exercise);
  }

  viewExercise(exercise: Exercise): void {
    this.router.navigate(['/general/exercise-view']);
  }
}
