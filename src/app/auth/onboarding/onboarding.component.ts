import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersStore } from '../../shared/stores/users.store';
import { TrainingStore } from '../../shared/stores/trainings.store';
import { ExercisesStore } from '../../shared/stores/exercises.store';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss'
})
export class OnboardingComponent {
  constructor(private router: Router, private usersStore: UsersStore, private traningsStore: TrainingStore, private exerciseStore: ExercisesStore) { }

  ngOnInit(): void {
    this.usersStore.loadAllUsers();
    this.usersStore.loadCurrentUser();
    this.traningsStore.loadAllTrainings();
    this.exerciseStore.loadAllExercises();

    this.usersStore.getCurrentUser().subscribe(user => {
      setTimeout(() => {
        if (user.roles.some(role => role.name === 'user')) {
          this.router.navigateByUrl('/members/home');
        } else {
          this.router.navigateByUrl('/personal/home');
        }
      }, 2500);
    });
  }
}
