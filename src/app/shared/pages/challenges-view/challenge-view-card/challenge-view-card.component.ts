import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../../../components/button/button.component';
import { Challenge } from '../../../models/challenge.model';
import { NgIf } from '@angular/common';
import { ChallengeCardComponent } from '../../../components/challenges-panel/challenges-card/challenge-card.component';
@Component({
  selector: 'app-challenge-view-card',
  standalone: true,
  imports: [ButtonComponent, NgIf, ChallengeCardComponent],
  templateUrl: './challenge-view-card.component.html',
  styleUrl: './challenge-view-card.component.scss'
})
export class ChallengeViewCardComponent {
  @Input() challenge!: Challenge;
  @Input() isAdmin: boolean = false;
  @Input() completed: boolean = false;
  @Output() completeChallenge = new EventEmitter<number>();

  completeChallengeClick(challengeId: number) {
    this.completeChallenge.emit(challengeId);
  }
}
