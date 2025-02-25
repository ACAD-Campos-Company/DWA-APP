import { Component, EventEmitter, Input, Output, ChangeDetectorRef, OnChanges, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { ButtonComponent } from '../../../components/button/button.component';
import { Challenge } from '../../../models/challenge.model';
import { NgIf } from '@angular/common';
import { ChallengeCardComponent } from '../../../components/challenges-panel/challenges-card/challenge-card.component';

@Component({
  selector: 'app-challenge-view-card',
  standalone: true,
  imports: [ButtonComponent, NgIf, ChallengeCardComponent],
  templateUrl: './challenge-view-card.component.html',
  styleUrl: './challenge-view-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChallengeViewCardComponent implements OnChanges {
  @Input() challenge!: Challenge;
  @Input() isAdmin: boolean = false;
  @Output() completeChallenge = new EventEmitter<number>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['challenge']) {
      if (this.challenge?.changes?.completed === true) {
        console.log(this.challenge);
        this.cdr.markForCheck();
      }
    }
  }

  completeChallengeClick(challengeId: number) {
    this.completeChallenge.emit(challengeId);
    this.cdr.detectChanges();
  }
}
