import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { map, Observable } from 'rxjs';
import { Training } from '../../../shared/models/training.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { TrainingEntityService } from '../../../store/training/training-entity.service';
import { User } from '../../../shared/models/users.model';
@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule, FilterComponent],
  templateUrl: './trainings.component.html',
  styleUrl: './trainings.component.scss'
})
export class TrainingsComponent {
  private readonly trainingEntityService = inject(TrainingEntityService);
  trainings$: Observable<Training[]> = this.trainingEntityService.entities$;
  filteredTrainings$: Observable<Training[]> = new Observable<Training[]>;

  currentUser: User = JSON.parse(localStorage.getItem('currentUser') || '{}');


  constructor() {
    this.filteredTrainings$ = this.trainings$;
  }

  onFilterChanged(filterText: string): void {
    this.filteredTrainings$ = this.trainings$.pipe(
      map((trainings: Training[]) =>
        trainings.filter((training: Training) =>
          training.name.toLowerCase().includes(filterText.toLowerCase())
        )
      )
    );
  }

}
