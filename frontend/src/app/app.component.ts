import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { LoadingService } from './shared/services/loading.service';
import { BodyClassDirective } from './shared/directives/body-class.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, BodyClassDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
