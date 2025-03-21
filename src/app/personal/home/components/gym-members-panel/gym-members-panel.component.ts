import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { User } from '../../../../shared/models/users.model';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { map, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Swiper, SwiperEvents, SwiperOptions } from 'swiper/types';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gym-members-panel',
  standalone: true,
  imports: [CommonModule, CardComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './gym-members-panel.component.html',
  styleUrl: './gym-members-panel.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GymMembersPanelComponent implements OnInit {
  @Input() gymMembers$: Observable<User[]> = new Observable<User[]>();
  filteredGymMembers$: Observable<User[]> = this.gymMembers$;
  searchForm: FormGroup = this.fb.group({
    searchTerm: ['']
  });

  private readonly destroy$ = new Subject<void>();

  swiperConfig: SwiperOptions = {
    grid: {
      rows: 3,
      fill: 'row'
    },
    scrollbar: {
      draggable: true,
      hide: false
    },
    modules: [Grid]
  };

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeFilteredGymMembers();
    this.setupSearchSubscription();
  }

  private initializeFilteredGymMembers(): void {
    this.filteredGymMembers$ = this.gymMembers$;
  }

  private setupSearchSubscription(): void {
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.onSearch());
  }

  public onSearch(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value?.toLowerCase() || '';

    this.filteredGymMembers$ = this.gymMembers$.pipe(
      map(gymMembers => this.filterGymMembers(gymMembers, searchTerm))
    );
  }

  private filterGymMembers(gymMembers: User[], searchTerm: string): User[] {
    if (!searchTerm) return gymMembers;

    return gymMembers.filter(gymMember =>
      this.matchesSearchCriteria(gymMember, searchTerm)
    );
  }

  private matchesSearchCriteria(gymMember: User, searchTerm: string): boolean {
    return (
      gymMember.username?.toLowerCase().includes(searchTerm) ||
      gymMember.document?.includes(searchTerm)
    ) ?? false;
  }
}
function Grid(options: { params: SwiperOptions; swiper: Swiper; extendParams: (obj: { [name: string]: any; }) => void; on: <E extends keyof SwiperEvents>(event: E, handler: SwiperEvents[E]) => void; once: <E extends keyof SwiperEvents>(event: E, handler: SwiperEvents[E]) => void; off: { <E extends keyof SwiperEvents>(event: E, handler: SwiperEvents[E]): void; <E extends keyof SwiperEvents>(event: E): void; }; emit: <E extends keyof SwiperEvents>(event: E, ...args: any[]) => void; }): void {
  throw new Error('Function not implemented.');
}

