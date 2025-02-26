import { inject, Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Challenge, ChallengeData } from '../../shared/models/challenge.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ChallengeDataService } from './challenge-data.service';

@Injectable({
  providedIn: 'root'
})
export class ChallengeEntityService extends EntityCollectionServiceBase<Challenge> {
  private challengesSubject = new BehaviorSubject<Challenge[]>([]);
  private challengeDataService = inject(ChallengeDataService);

  readonly challenges$ = this.challengesSubject.asObservable();

  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
  ) {
    super('Challenges', serviceElementsFactory);
  }

  override getAll(): Observable<Challenge[]> {
    super.getAll().subscribe(challenges => {
      this.challengesSubject.next(challenges);
    });

    return this.challenges$;
  }

  getChallengeById(id: number): Observable<Challenge | undefined> {
    return this.challenges$.pipe(
      map(challenges => challenges.find(challenge => challenge.id === id))
    );
  }

  getTodayChallenges(): Observable<Challenge[]> {
    this.challengeDataService.getTodayChallenges().subscribe(challenges => {
      this.challengesSubject.next(challenges);
      this.addAllToCache(challenges);
    });

    return this.challenges$;
  }

  completeChallenge(payload: { challenge_id: number, user_id: number }): Observable<Challenge> {
    return this.challengeDataService.completeChallenge(payload).pipe(
      tap((response: Challenge) => {
        const update = { id: response.challenge_id, changes: response };

        super.updateOneInCache(update);
        const currentChallenges = this.challengesSubject.getValue();
        if (currentChallenges.some(ch => ch.id === response.challenge_id)) {
          this.challengesSubject.next(
            currentChallenges.map(ch =>
              ch.id === response.challenge_id ? response : ch
            )
          );
        }
      })
    );
  }
} 