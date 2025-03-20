import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Exercise, Repetition } from '../../models/exercise.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-card-exercise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card-exercise.component.html',
  styleUrls: ['./user-card-exercise.component.scss']
})
export class UserCardExerciseComponent {
  @Input() exercise!: Exercise;
  @Input() isTrainingStarted: boolean = false;
  @Input() isTrainingPaused: boolean = false;
  @Input() isTrainingCompleted: boolean = false;
  @Input() isExerciseCompleted: boolean = false;
  @Input() isOtherTrainingActive: boolean = false;
  @Input() isAdmin: boolean = false;
  @Output() exerciseClicked = new EventEmitter<Exercise>();
  @Output() exerciseToggled = new EventEmitter<Exercise>();

  onExerciseClick(): void {
    this.exerciseClicked.emit(this.exercise);
  }

  onToggleExercise(event: Event) {
    event.stopPropagation();
    if (this.isTrainingCompleted || !this.isTrainingStarted || this.isTrainingPaused) return;
    
    this.exerciseToggled.emit(this.exercise);
  }

  formatRepetitions(repetitions: Repetition[]): string {
    if (!repetitions || repetitions.length === 0) return '0';

    const allEqual = repetitions.every(rep => rep.repetitions === repetitions[0].repetitions);
    
    if (allEqual) {
      return repetitions[0].repetitions.toString();
    }

    return repetitions.map(rep => rep.repetitions).join('/');
  }

  formatMethodology(methodology: string | null): string {
    if (!methodology) return '';
    
    const maxLength = 30;
    if (methodology.length <= maxLength) return methodology;
    
    return methodology.substring(0, maxLength) + '...';
  }
}
