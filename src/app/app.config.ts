import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LoadingService } from './shared/services/loading.service';
import { AuthInterceptor } from './shared/utils/interceptors/auth.interceptor';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { reducers } from './store';
import { provideEntityData, withEffects } from '@ngrx/data';

import { TrainingDataService } from './store/training/training-data.service';
import { EntityDataService } from '@ngrx/data';
import { APP_INITIALIZER } from '@angular/core';
import { routes } from './app.routes';
import { entityConfig } from './entity-metadata';
import { ExerciseDataService } from './store/exercise/exercise-data.service';
import { UserDataService } from './store/user/user-data.service';
import { AuthDataService } from './auth/store/auth-data.service';
import { ChallengeDataService } from './store/challenge/challenge-data.service';
import { TrainingViewDataService } from './store/training-view/training-view-data.service';
import { PushNotificationService } from './shared/services/push-notification.service';

export function initializeEntityDataService(
  entityDataService: EntityDataService,
  trainingDataService: TrainingDataService,
  trainingViewDataService: TrainingViewDataService,
  exerciseDataService: ExerciseDataService,
  userDataService: UserDataService,
  authDataService: AuthDataService,
  challengeDataService: ChallengeDataService
) {
  return () => {
    entityDataService.registerService('Trainings', trainingDataService);
    entityDataService.registerService('UserTrainings', trainingViewDataService);
    entityDataService.registerService('Exercises', exerciseDataService);
    entityDataService.registerService('Users', userDataService);
    entityDataService.registerService('Auth', authDataService);
    entityDataService.registerService('Challenges', challengeDataService);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    LoadingService,
    provideStore({
        ...reducers,
        router: routerReducer
    }, {
        runtimeChecks: {
            strictStateImmutability: true,
            strictActionImmutability: true,
            strictStateSerializability: true,
            strictActionSerializability: true,
            strictActionWithinNgZone: true,
            strictActionTypeUniqueness: true
        }
    }),
    provideEffects([]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideRouterStore(),
    provideEntityData(entityConfig, withEffects()),
    TrainingDataService,
    TrainingViewDataService,
    ExerciseDataService,
    UserDataService,
    AuthDataService,
    ChallengeDataService,
    {
        provide: APP_INITIALIZER,
        useFactory: initializeEntityDataService,
        deps: [
            EntityDataService,
            TrainingDataService,
            TrainingViewDataService,
            ExerciseDataService,
            UserDataService,
            AuthDataService,
            ChallengeDataService
        ],
        multi: true
    },
    PushNotificationService
  ]
};
