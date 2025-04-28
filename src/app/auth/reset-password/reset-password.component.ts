import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingService } from '../../shared/services/loading.service';
import { encodePasswordFields, passwordMatchValidator, passwordStrengthValidator } from '../../shared/utils/validators/password.validator';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ForgotPasswordRes } from '../../shared/models/authenticate.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthEntityService } from '../store/auth-entity.service';
import Swal from 'sweetalert2';


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
    RouterModule
  ],
  providers: [LoadingService, AuthEntityService]
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild('firstStepTemplate', { static: true }) firstStepTemplate!: TemplateRef<any>;
  @ViewChild('secondStepTemplate', { static: true }) secondStepTemplate!: TemplateRef<any>;
  @ViewChild('thirdStepTemplate', { static: true }) thirdStepTemplate!: TemplateRef<any>;

  private readonly fb = inject(FormBuilder);
  private readonly loadingService = inject(LoadingService);
  private readonly authEntityService = inject(AuthEntityService);
  private readonly router = inject(Router);

  firstStepForm!: FormGroup;
  secondStepForm!: FormGroup;
  thirdStepForm!: FormGroup;

  currentStep: number = 1;
  userID: number = 0;
  token: string = '';

  private readonly errorMessageSubject = new BehaviorSubject<string | null>(null);
  private readonly userPhoneSubject = new BehaviorSubject<string | null>(null);

  readonly errorMessage$ = this.errorMessageSubject.asObservable();
  readonly userPhone$ = this.userPhoneSubject.asObservable();

  ngOnInit(): void {
    this.initForms();
  }

  private initForms(): void {
    this.firstStepForm = this.fb.group({
      document: ['', [Validators.required]]
    });

    this.secondStepForm = this.fb.group({
      code: ['', [Validators.required]]
    });

    this.thirdStepForm = this.fb.group({
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        passwordStrengthValidator()
      ]],
      password_confirmation: ['', [Validators.required]]
    }, { validators: passwordMatchValidator() });
  }

  handleBackButtonClick(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessageSubject.next(null);
    }
  }

  public onSubmit(): void {
    switch (this.currentStep) {
      case 1:
        if (this.firstStepForm.valid) {
          this.executeStep1();
        }
        break;
      case 2:
        if (this.secondStepForm.valid) {
          this.executeStep2();
        }
        break;
      case 3:
        if (this.thirdStepForm.valid) {
          this.finalizeReset();
        }
        break;
    }
  }

  public getCurrentStepTemplate(): TemplateRef<any> {
    switch (this.currentStep) {
      case 1:
        return this.firstStepTemplate;
      case 2:
        return this.secondStepTemplate;
      case 3:
        return this.thirdStepTemplate;
      default:
        return this.firstStepTemplate;
    }
  }

  private executeStep1(): void {
    const auth$: Observable<ForgotPasswordRes> = this.authEntityService.resetPasswordStep1(this.firstStepForm.value.document);

    this.loadingService.showLoaderUntilCompleted(auth$).subscribe({
      next: (res: ForgotPasswordRes) => {
        this.userPhoneSubject.next(this.formatPhoneNumber(res.data.telephone));
        this.userID = res.data.userID;
        this.currentStep++
        this.errorMessageSubject.next(null);
      },
      error: (err) => this.errorMessageSubject.next(err.error?.message || 'Erro inesperado.'),
    });
  }

  private executeStep2(): void {
    const payload = {
      code: this.secondStepForm.value.code,
      userID: this.userID
    };

    const auth$: Observable<ForgotPasswordRes> = this.authEntityService.resetPasswordStep2(payload);

    this.loadingService.showLoaderUntilCompleted(auth$).subscribe({
      next: (res: ForgotPasswordRes) => {
        this.token = res.data.token;
        this.currentStep++;
        this.errorMessageSubject.next(null);
      },
      error: (err) => this.errorMessageSubject.next(err.error?.message || 'Erro inesperado.'),
    });
  }

  private finalizeReset(): void {
    const formValues = encodePasswordFields(this.thirdStepForm.getRawValue(), [
      'password',
      'password_confirmation',
    ]);

    const payload = {
      ...formValues,
      userID: this.userID,
      token: this.token
    };

    const auth$ = this.authEntityService.resetPasswordLastStep(payload);

    this.loadingService.showLoaderUntilCompleted(auth$).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: res.message,
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });

        setTimeout(() => {
          this.router.navigateByUrl('login');
        }, 1500);
      },
      error: (err) => this.errorMessageSubject.next(err.error?.message || 'Erro inesperado.'),
    });
  }

  private formatPhoneNumber(phone: string): string {
    return phone.replace(/(\d{2})(\d{1})\d{4}(\d{4})/, '($1) $2****-$3');
  }

  public clearErrorMessage(): void {
    this.errorMessageSubject.next(null);
  }
}