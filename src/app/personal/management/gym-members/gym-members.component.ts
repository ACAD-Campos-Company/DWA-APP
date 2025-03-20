import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { User } from '../../../shared/models/users.model';
import { Observable } from 'rxjs';
import { UserEntityService } from '../../../store/user/user-entity.service';
import { Router } from '@angular/router';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-gym-members',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TruncatePipe],
  templateUrl: './gym-members.component.html',
  styleUrl: './gym-members.component.scss'
})
export class GymMembersComponent {
  readonly userEntityService = inject(UserEntityService);
  private readonly router = inject(Router); 

  members$: Observable<User[]> = this.userEntityService.entities$;

  goToMemberView(memberId: number): void {
    this.router.navigate(['/personal/gym-members', memberId]);
  }
}
