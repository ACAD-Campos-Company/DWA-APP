import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { User } from '../../../shared/models/users.model';
import { Observable, map } from 'rxjs';
import { UserEntityService } from '../../../store/user/user-entity.service';
import { Router } from '@angular/router';
import { FilterComponent } from '../../../shared/components/filter/filter.component';

@Component({
  selector: 'app-gym-members',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FilterComponent],
  templateUrl: './gym-members.component.html',
  styleUrl: './gym-members.component.scss'
})
export class GymMembersComponent {
  readonly userEntityService = inject(UserEntityService);
  private readonly router = inject(Router); 

  members$: Observable<User[]> = this.userEntityService.entities$;
  filteredMembers$: Observable<User[]> = this.members$;

  goToMemberView(memberId: number): void {
    this.router.navigate(['/personal/gym-members', memberId]);
  }

  onFilterChanged(searchTerm: string): void {
    this.filteredMembers$ = this.members$.pipe(
      map(members => {
        if (!searchTerm) return members;
        const term = searchTerm.toLowerCase();
        return members.filter(member => 
          member.username?.toLowerCase().includes(term) ||
          member.email?.toLowerCase().includes(term) ||
          member.telephone?.includes(term) ||
          member.document?.includes(term)
        );
      })
    );
  }
}
