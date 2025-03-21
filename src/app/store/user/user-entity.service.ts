import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { User } from '../../shared/models/users.model';
import { map, tap } from 'rxjs/operators';
import { UserDataService } from './user-data.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserEntityService extends EntityCollectionServiceBase<User> {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  
  readonly currentUser$ = this.currentUserSubject.asObservable();
  readonly isAdmin$ = this.isAdminSubject.asObservable();

  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    private userDataService: UserDataService
  ) {
    super('Users', serviceElementsFactory);
  }

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
    this.isAdminSubject.next(!user.roles.map(role => role.name).includes('user'));
  }

  getCurrentUser(): User {
    return this.currentUserSubject.getValue();
  }

  getIsAdmin(): boolean {
    return this.isAdminSubject.getValue();
  }

  override update(user: Partial<User>) {
    const update = { id: user.id!, changes: user };
    return this.userDataService.update(update).pipe(
      tap(updatedUser => {
        super.updateOneInCache(updatedUser);
        if (updatedUser.id === this.getCurrentUser().id) {
          this.setCurrentUser(updatedUser);
        }
      })
    );
  }

  sendTokenStorage(device_token: string, device_os: string) {
    return this.userDataService.sendTokenStorage(device_token, device_os);
  }

  getGymMembers() {
    return this.entities$.pipe(
      map(users => users.filter(user => user.roles.some(role => role.name === 'user')))
    );
  }

  clearUserState(): void {
    this.currentUserSubject.next({} as User);
    this.isAdminSubject.next(false);
    this.clearCache();
  }
} 