import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, map, tap, switchMap, of, BehaviorSubject } from 'rxjs';
import { Challenge, UserChallenge } from '../../../../shared/models/challenge.model';
import { ChallengeEntityService } from '../../../../store/challenge/challenge-entity.service';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-challenge-view',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  templateUrl: './challenge-view.component.html',
  styleUrls: ['./challenge-view.component.scss']
})
export class ChallengeViewComponent {
  private readonly challengeEntityService = inject(ChallengeEntityService);

  challenge$: Observable<Challenge | undefined> = this.challengeEntityService.challengeById$;
} 