import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { TermsService } from '../../shared/services/terms.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms-privacy',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './terms-privacy.component.html',
  styleUrl: './terms-privacy.component.scss'
})
export class TermsPrivacyComponent implements OnInit {
  private readonly termsService = inject(TermsService);
  termsHtml: string = '';

  ngOnInit(): void {
    this.termsHtml = this.termsService['getPrivacyPolicyHtml']();
  }
}
