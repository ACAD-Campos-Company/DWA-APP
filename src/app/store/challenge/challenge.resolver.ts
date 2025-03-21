import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { tap, filter, first, map } from 'rxjs/operators';
import { ChallengeEntityService } from './challenge-entity.service';
import { UserEntityService } from '../user/user-entity.service';
import { ActivatedRoute } from '@angular/router';

export const challengeResolver: ResolveFn<boolean> = (route) => {
  const challengeEntityService = inject(ChallengeEntityService);
  const userEntityService = inject(UserEntityService);
  
  const challengeId = route.paramMap.get('id');
  const numericChallengeId = challengeId ? +challengeId : null;
  
  if (numericChallengeId && !isNaN(numericChallengeId)) {
    challengeEntityService.getChallengeById(numericChallengeId);
    return challengeEntityService.challengeById$.pipe(
      filter(challenge => !!challenge),
      first(),
      map(() => true)
    );
  }
  
  const isAdmin = userEntityService.getIsAdmin();
  
  return challengeEntityService.loaded$.pipe(
    tap(loaded => {
      if (!loaded) {
        if (isAdmin) {
          challengeEntityService.getAll();
        } else {
          challengeEntityService.getTodayChallenges();
        }
      }
    }),
    filter(loaded => !!loaded),
    first()
  );
};
