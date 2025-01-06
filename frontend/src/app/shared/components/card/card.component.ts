import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() validity?: string;
  @Input() duration?: string;
  @Input() imageSrc!: string;
  @Input() iconSrc?: string;
  @Input() size: 'small' | 'large' = 'large';
}
