import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { User } from '../../shared/models/users.model';
import { Observable, tap, map, BehaviorSubject } from 'rxjs';
import { AuthenticateLogin, ForgotPasswordRes } from '../../shared/models/authenticate.model';
import { AuthDataService } from './auth-data.service';
import { UserEntityService } from '../../store/user/user-entity.service';
import { ExerciseEntityService } from '../../store/exercise/exercise-entity.service';
import { TrainingEntityService } from '../../store/training/training-entity.service';
import { ChallengeEntityService } from '../../store/challenge/challenge-entity.service';

interface AuthState {
    user: User;
    token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthEntityService extends EntityCollectionServiceBase<AuthState> {
    private tokenSubject = new BehaviorSubject<string>('');
    readonly token$ = this.tokenSubject.asObservable();

    readonly authState$ = this.entities$.pipe(
        map(entities => entities[0]),
        tap(state => {
            if (state?.token) {
                this.tokenSubject.next(state.token);
            }
        })
    );

    constructor(
        serviceElementsFactory: EntityCollectionServiceElementsFactory,
        private authDataService: AuthDataService,
        private userEntityService: UserEntityService,
        private exerciseEntityService: ExerciseEntityService,
        private trainingEntityService: TrainingEntityService,
        private challengeEntityService: ChallengeEntityService,
    ) {
        super('Auth', serviceElementsFactory);
        this.authState$.subscribe();
    }

    getToken(): string {
        return this.tokenSubject.getValue();
    }

    authenticate(credentials: { document: string; password: string, fromApp: boolean }): Observable<AuthenticateLogin> {
        return this.authDataService.authenticate(credentials).pipe(
            tap((response: AuthenticateLogin) => {
                if (response.data.token) {
                    this.addOneToCache({ user: response.data.user, token: response.data.token });
                    this.tokenSubject.next(response.data.token);
                    localStorage.setItem('token', response.data.token);
                    this.userEntityService.setCurrentUser(response.data.user);
                }
            })
        );
    }

    logout(): Observable<void> {
        return this.authDataService.logout().pipe(
            tap(() => {
                this.tokenSubject.next('');
                localStorage.removeItem('token');
                this.clearCache();
                this.userEntityService.clearUserState();
                this.exerciseEntityService.clearCache();
                this.trainingEntityService.clearCache();
                this.challengeEntityService.clearCache();
            })
        );
    }

    resetPasswordStep1(document: string): Observable<ForgotPasswordRes> {
        return this.authDataService.resetPasswordStep1(document);
    }

    resetPasswordStep2(payload: { code: string; userID: number }): Observable<ForgotPasswordRes> {
        return this.authDataService.resetPasswordStep2(payload);
    }

    resetPasswordLastStep(payload: {
        password: string;
        confirm_password: string;
        token: string;
        id: number;
    }): Observable<ForgotPasswordRes> {
        return this.authDataService.resetPasswordLastStep(payload);
    }
} 