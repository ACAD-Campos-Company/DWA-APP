import { ChangeDetectionStrategy, Component, Input, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../models/users.model';
import { PushNotificationService } from '../../services/push-notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() hasHome: boolean = false;
  @Input() routeNameBack: string | null = null;
  @Input() homeMode: boolean = false;
  @Input() currentUser: User = {} as User;
  @Input() isAdmin: boolean = false;
  @Input() routeName: string = '';

  private readonly location = inject(Location);
  private readonly pushNotificationService = inject(PushNotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  currentCount: number = 0;

  constructor() {
    this.routeName = this.isAdmin ? '/personal/home' : '/members/home';

    this.pushNotificationService.unreadCount$.subscribe(count => {
      this.currentCount = count;
      this.cdr.markForCheck();
    });
  }

  goBack(): void {
    if (!this.routeNameBack) {
      this.location.back();
    }
  }
}
