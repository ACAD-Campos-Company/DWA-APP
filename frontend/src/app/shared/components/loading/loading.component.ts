import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  templateUrl: './loading.component.html',
  imports: [CommonModule],
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) { }
}
