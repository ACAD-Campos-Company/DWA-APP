import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { tap, filter, first, map } from 'rxjs/operators';
import { TrainingViewEntityService } from '../../../store/training-view/training-view-entity.service';

export const gymMemberResolver: ResolveFn<boolean> = (route) => {
  const trainingViewEntityService = inject(TrainingViewEntityService);
  const userId = +route.params['id'];
  
  return trainingViewEntityService.getTrainingByUserId(userId).pipe(
    tap(trainings => {
      trainingViewEntityService.upsertManyInCache(trainings);
    }),
    map(trainings => !!trainings),
    first()
  );
}; 