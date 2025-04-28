import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { User } from '../../shared/models/users.model';
import { Observable, tap, map, BehaviorSubject, of, finalize } from 'rxjs';
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
    private initialized = false;

    readonly authState$ = this.entities$.pipe(
        map(entities => entities[0]),
        tap(state => {
            if (state?.token) {
                this.setTokenFromStorage(state.token, state.user);
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
        this.initializeAuth();
    }

    private initializeAuth(): void {
        if (this.initialized) return;
        
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('currentUser');
        
        if (storedToken && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                this.setTokenFromStorage(storedToken, user);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                this.clearAuthData();
            }
        }
        
        this.initialized = true;
        this.authState$.subscribe();
    }

    getToken(): string {
        let token = this.tokenSubject.getValue();
        if (!token) {
            token = localStorage.getItem('authToken') || '';
            if (token) {
                this.tokenSubject.next(token);
            }
        }
        return token;
    }
    
    setTokenFromStorage(token: string, user?: User): void {
        if (!token) return;
        
        this.tokenSubject.next(token);
        localStorage.setItem('authToken', token);
        
        if (user) {
            this.addOneToCache({ user, token });
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.userEntityService.setCurrentUser(user);
            localStorage.setItem('isLoggedIn', 'true');
        }
    }

    authenticate(credentials: { document: string; password: string, fromApp: boolean }): Observable<AuthenticateLogin> {
        return this.authDataService.authenticate(credentials).pipe(
            tap((response: AuthenticateLogin) => {
                if (response.data.token) {
                    this.setTokenFromStorage(response.data.token, response.data.user);
                }
            })
        );
    }

    logout(): Observable<void> {
        return this.authDataService.logout();
    }

    clearAuthData(): void {
        this.tokenSubject.next('');
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        this.clearCache();
        this.userEntityService.clearUserState();
        this.exerciseEntityService.clearCache();
        this.trainingEntityService.clearCache();
        this.challengeEntityService.clearCache();
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