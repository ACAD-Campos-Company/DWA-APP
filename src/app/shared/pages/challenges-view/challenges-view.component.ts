import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { UserEntityService } from '../../../store/user/user-entity.service';
import { ChallengeViewCardComponent } from './challenge-view-card/challenge-view-card.component';
import { ChallengeEntityService } from '../../../store/challenge/challenge-entity.service';
import { Challenge } from '../../models/challenge.model';
import { User } from '../../models/users.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-challenges-view',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ChallengeViewCardComponent],
  templateUrl: './challenges-view.component.html',
  styleUrl: './challenges-view.component.scss'
})
export class ChallengesViewComponent implements OnInit {

  private readonly challengesService = inject(ChallengeEntityService);

  challenges$: Observable<Challenge[]> = new Observable();
  completedChallenges$: Observable<Challenge[]> = new Observable();

  user: User = inject(UserEntityService).getCurrentUser();
  userID: number = this.user.id;
  isAdmin: boolean = this.user.roles.map(role => role.name).includes('admin');

  ngOnInit(): void {
    this.initializeChallenges();
  }

  private initializeChallenges(): void {
    this.challenges$ = this.challengesService.challenges$.pipe(
      map(challenges => challenges.filter(challenge => !challenge.completed))
    );

    this.completedChallenges$ = this.challengesService.challenges$.pipe(
      map(challenges => challenges.filter(challenge => challenge.completed))
    );
  }

  public completeChallenge(challengeId: number): void {
    this.challengesService.completeChallenge({ challenge_id: challengeId, user_id: this.userID }).pipe(
      tap(() => {
        Swal.fire({
          title: 'Parabéns!',
          text: 'Desafio concluído com sucesso, continue assim!',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      }),
      catchError((error) => {
        console.error('Error updating challenge:', error);
        return of(null);
      })
    ).subscribe();
  }
}
