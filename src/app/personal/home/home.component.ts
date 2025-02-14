import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable, take, combineLatest } from 'rxjs';
import { User } from '../../shared/models/users.model';
import { Training } from '../../shared/models/training.model';
import { Exercise } from '../../shared/models/exercise.model';
import { KeymetricPanelComponent } from './components/keymetric-panel/keymetric-panel.component';
import { ActionsPanelComponent } from './components/actions-panel/actions-panel.component';
import { GymMembersPanelComponent } from './components/gym-members-panel/gym-members-panel.component';
import { TrainingsPanelComponent } from '../../shared/components/trainings-panel/trainings-panel.component';
import { LoadingService } from '../../shared/services/loading.service';
import { RouterModule } from '@angular/router';
import { TrainingEntityService } from '../../store/training/training-entity.service';
import { ExerciseEntityService } from '../../store/exercise/exercise-entity.service';
import { UserEntityService } from '../../store/user/user-entity.service';
import { ChallengeEntityService } from '../../store/challenge/challenge-entity.service';
import { Challenge } from '../../shared/models/challenge.model';
import { ChallengesPanelComponent } from '../../shared/components/challenges-panel/challenges-panel.component';
import { TrainingViewEntityService } from '../../store/training-view/training-view-entity.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { PushNotificationService } from '../../shared/services/push-notification.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    KeymetricPanelComponent,
    ActionsPanelComponent,
    TrainingsPanelComponent,
    GymMembersPanelComponent,
    RouterModule,
    ChallengesPanelComponent,
    HeaderComponent
  ],
  providers: [LoadingService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly trainingEntityService = inject(TrainingEntityService);
  private readonly exerciseEntityService = inject(ExerciseEntityService);
  private readonly userEntityService = inject(UserEntityService);
  private readonly challengeEntityService = inject(ChallengeEntityService);
  private readonly trainingViewEntityService = inject(TrainingViewEntityService);
  private readonly pushNotificationService = inject(PushNotificationService);

  notificationCount$ = this.pushNotificationService.unreadCount$;

  challenges$: Observable<Challenge[]> = this.challengeEntityService.entities$;

  trainings$: Observable<Training[]> = this.trainingEntityService.entities$;
  trainingCount$: Observable<number> = this.trainings$.pipe(
    map((trainings: Training[]) => trainings.length)
  );

  exercises$: Observable<Exercise[]> = this.exerciseEntityService.entities$;
  exerciseCount$: Observable<number> = this.exercises$.pipe(
    map((exercises: Exercise[]) => exercises.length)
  );

  users$: Observable<User[]> = this.userEntityService.entities$;
  gymMembers$: Observable<User[]> = this.userEntityService.getGymMembers();
  isAdmin: boolean = this.userEntityService.getIsAdmin();

  currentUser$: Observable<User> = this.userEntityService.currentUser$;
  userCount$: Observable<number> = this.users$.pipe(
    map((users: User[]) => users.length)
  );

  ngOnInit(): void {
    combineLatest([
      this.trainings$.pipe(take(1)),
      this.trainingViewEntityService.trainingView$.pipe(take(1))
    ]).subscribe(([trainings, trainingViews]) => {
      if (JSON.stringify(trainings) !== JSON.stringify(trainingViews)) {
        this.trainingViewEntityService.upsertManyInCache(trainings);
      }
    });
  }

}
