import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../models/users.model';
import { PushNotificationService } from '../../services/push-notification.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() hasHome: boolean = false;
  @Input() routeNameBack: string | null = null;
  @Input() homeMode: boolean = false;
  @Input() currentUser: User = {} as User;
  @Input() isAdmin: boolean = false;
  @Input() routeName: string = this.isAdmin ? '/personal/home' : '/members/home';

  currentCount: number = 0;

  constructor(
    private location: Location,
    private pushNotificationService: PushNotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.pushNotificationService.unreadCount$.subscribe(count => {
      console.log('Subscribe - Novo contador:', count);
      this.currentCount = count;
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    console.log('Header Component initialized');
  }

  goBack(): void {
    if (!this.routeNameBack) {
      this.location.back();
    }
  }
}
