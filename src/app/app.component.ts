import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { PushNotificationService } from './shared/services/push-notification.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'DWAPP';

  constructor(private pushNotificationService: PushNotificationService) {}

  ngOnInit() {
    this.pushNotificationService.initPush();
    this.pushNotificationService.loadSavedNotifications();
  }
}
