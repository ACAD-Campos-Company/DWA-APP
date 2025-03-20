import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, map, switchMap, tap, shareReplay, of, take, finalize } from 'rxjs';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { User } from '../../../../shared/models/users.model';
import { UserEntityService } from '../../../../store/user/user-entity.service';
import { Training } from '../../../../shared/models/training.model';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { formatDuration } from '../../../../shared/utils/helpers/duration.helper';
import { TrainingViewEntityService } from '../../../../store/training-view/training-view-entity.service';
import { LoadingService } from '../../../../shared/services/loading.service';

@Component({
  selector: 'app-gym-member-view',
  standalone: true,
  imports: [HeaderComponent, CommonModule, CardComponent, RouterModule],
  templateUrl: './gym-member-view.component.html',
  styleUrl: './gym-member-view.component.scss'
})
export class GymMemberViewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userEntityService = inject(UserEntityService);
  private readonly trainingViewEntityService = inject(TrainingViewEntityService);

  private userId: number = +this.route.snapshot.params['id'];

  member$: Observable<User> = this.userEntityService.entities$.pipe(
    map(users => users.find(user => user.id === this.userId)),
    tap(user => {
      if (!user) {
        this.router.navigate(['/personal/gym-members']);
      }
    }),
    map(user => user!)
  );

  trainings$ = this.trainingViewEntityService.trainingView$;

  formatDuration = formatDuration;

  getDuration(training: Training): string {
    return this.formatDuration(
      training.last_duration || 
      (training.duration ? training.duration.toString() : '00:00')
    );
  }
}
