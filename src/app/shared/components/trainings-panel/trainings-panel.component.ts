import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Training } from '../../models/training.model';
import { CardComponent } from '../card/card.component';
import { formatDuration } from '../../utils/helpers/duration.helper';
import { User } from '../../models/users.model';

@Component({
  selector: 'app-trainings-panel',
  standalone: true,
  imports: [CommonModule, CardComponent, RouterModule],
  templateUrl: './trainings-panel.component.html',
  styleUrls: ['./trainings-panel.component.scss']
})
export class TrainingsPanelComponent {
  @Input() trainings: Training[] = [];
  @Input() title: string = 'TREINOS CADASTRADOS';
  @Input() showTodayTraining = false;
  @Input() isPersonal = false;
  @Input() showButton = false;

  currentUser: User = JSON.parse(localStorage.getItem('currentUser') || '{}');

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  formatDuration = formatDuration;
}
