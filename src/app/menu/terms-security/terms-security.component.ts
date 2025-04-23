import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { TermsService } from '../../shared/services/terms.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms-security',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './terms-security.component.html',
  styleUrl: './terms-security.component.scss'
})
export class TermsSecurityComponent implements OnInit {
  private readonly termsService = inject(TermsService);
  termsHtml: string = '';

  ngOnInit(): void {
    this.termsHtml = this.termsService['getTermsOfUseHtml']();
  }
}
