import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise } from '../../models/exercise.model';
import { Router } from '@angular/router';


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

  private readonly router = inject(Router);

  onExerciseClick(): void {
    this.exerciseClicked.emit(this.exercise);
  }

  viewExercise(): void {
    this.router.navigate(['/general/exercise-view']);
  }
}
