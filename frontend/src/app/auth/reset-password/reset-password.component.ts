import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingService } from '../../shared/services/loading.service';
import { AuthService } from '../../shared/services/auth.service';
import { encodePasswordFields, passwordMatchValidator } from '../../shared/utils/validators/password.validator';
import { OnlyOneErrorPipe } from '../../shared/utils/pipes/only-one-error.pipe';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ForgotPasswordRes } from '../../shared/models/authenticate';
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  imports: [
    InputComponent,
    ButtonComponent,
    LoadingComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    OnlyOneErrorPipe
  ],
  providers: [LoadingService, AuthService]
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild('firstStepTemplate', { static: true }) firstStepTemplate!: TemplateRef<any>;
  @ViewChild('secondStepTemplate', { static: true }) secondStepTemplate!: TemplateRef<any>;
  @ViewChild('thirdStepTemplate', { static: true }) thirdStepTemplate!: TemplateRef<any>;
  @ViewChild('fourthStepTemplate', { static: true }) fourthStepTemplate!: TemplateRef<any>;

  firstStepForm: FormGroup = new FormGroup({});
  secondStepForm: FormGroup = new FormGroup({});
  fourthStepForm: FormGroup = new FormGroup({});

  currentStep: number = 1;
  token: string | null = null;
  userId: string | null = '';

  errorMessage = new BehaviorSubject<string | null>(null);
  successMessage = new BehaviorSubject<string | null>(null);
  sentSmsMessage = new BehaviorSubject<string | null>(null);
  userPhone = new BehaviorSubject<string | null>(null);

  errorMessage$ = this.errorMessage.asObservable();
  successMessage$ = this.successMessage.asObservable();
  sentSmsMessage$ = this.sentSmsMessage.asObservable();
  userPhone$ = this.userPhone.asObservable();

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get('token');
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.token) this.currentStep = 4;

    this.initForms();
  }

  private initForms(): void {
    if (this.currentStep === 1) {
      this.firstStepForm = this.fb.group({
        document: ['', [Validators.required]]
      });

      this.secondStepForm = this.fb.group({
        telephone: ['', [Validators.required]]
      });
    } else if (this.currentStep === 4) {
      this.fourthStepForm = this.fb.group(
        {
          password: ['', [Validators.required]],
          password_confirmation: ['', Validators.required],
        },
        { validators: [passwordMatchValidator()] }
      );
    }
  }

  handleBackButtonClick(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage.next(null);
    }
  }

  onSubmit(): void {
    if (this.currentStep === 1 && this.firstStepForm.valid) {
      this.executeStep1();
    } else if (this.currentStep === 2 && this.secondStepForm.valid) {
      this.executeStep2();
    } else if (this.currentStep === 4 && this.fourthStepForm.valid) {
      this.finalizeReset();
    }
  }

  getCurrentStepTemplate(): TemplateRef<any> | null {
    const templates: { [key: number]: TemplateRef<any> } = {
      1: this.firstStepTemplate,
      2: this.secondStepTemplate,
      3: this.thirdStepTemplate,
      4: this.fourthStepTemplate,
    };
    return templates[this.currentStep] || null;
  }

  private executeStep1(): void {
    const auth$: Observable<ForgotPasswordRes> = this.authService.resetPasswordStep1(this.firstStepForm.value);

    this.loadingService.showLoaderUntilCompleted(auth$).subscribe({
      next: (res: ForgotPasswordRes) => {
        this.userPhone.next(this.formatPhoneNumber(res.data.telephone));
        this.currentStep++
      },
      error: (err) => this.errorMessage.next(err.error?.message || 'Erro inesperado.'),
    });
  }

  private executeStep2(): void {
    const payload = {
      ...this.firstStepForm.value,
      ...this.secondStepForm.value,
    };

    const auth$: Observable<ForgotPasswordRes> = this.authService.resetPasswordStep2(payload);

    this.loadingService.showLoaderUntilCompleted(auth$).subscribe({
      next: (res) => {
        this.sentSmsMessage.next(res.message);
        this.currentStep++
      },
      error: (err) => this.errorMessage.next(err.error?.message || 'Erro inesperado.'),
    });
  }

  private formatPhoneNumber(phone: string): string {
    const maskedPhone = phone.replace(/(\d{2})(\d{1})\d{4}(\d{4})/, '($1) $2****-$3');
    return maskedPhone;
  }

  private finalizeReset(): void {
    const formValues = encodePasswordFields(this.fourthStepForm.getRawValue(), [
      'password',
      'password_confirmation',
    ]);

    const payload = {
      ...formValues,
      token: this.token,
      id: this.userId
    }

    if (this.token && this.userId) {
      const auth$ = this.authService.resetPasswordLastStep(payload);

      this.loadingService.showLoaderUntilCompleted(auth$).subscribe({
        next: (res) => {
          this.successMessage.next(res.message);

          setTimeout(() => {
            this.route.navigateByUrl('login');
          }, 1500);
        },
        error: (err) => this.errorMessage.next(err.error?.message || 'Erro inesperado.'),
      })
    }
  }
}