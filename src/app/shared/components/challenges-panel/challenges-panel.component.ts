import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Challenge } from '../../models/challenge.model';

import { ChallengeEntityService } from '../../../store/challenge/challenge-entity.service';
import { SwiperOptions } from 'swiper/types';

import { RouterModule } from '@angular/router';
import { ChallengeCardComponent } from './challenges-card/challenge-card.component';

@Component({
  selector: 'app-challenges-panel',
  standalone: true,
  imports: [CommonModule, ChallengeCardComponent, RouterModule],
  templateUrl: './challenges-panel.component.html',
  styleUrl: './challenges-panel.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChallengesPanelComponent {
  private readonly challengeEntityService = inject(ChallengeEntityService);
  challenges$: Observable<Challenge[]> = this.challengeEntityService.entities$;

  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    pagination: true
  };
}