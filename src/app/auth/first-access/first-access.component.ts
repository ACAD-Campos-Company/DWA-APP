import { Component, inject, OnInit } from '@angular/core';
import { InputComponent } from '../../shared/components/input/input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LoadingService } from '../../shared/services/loading.service';
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { encodePasswordFields, passwordMatchValidator, passwordStrengthValidator } from '../../shared/utils/validators/password.validator';
import { BehaviorSubject, catchError, finalize, of, tap } from 'rxjs';
import { AuthEntityService } from '../store/auth-entity.service';
import { UserEntityService } from '../../store/user/user-entity.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { TermsService } from '../../shared/services/terms.service';
import { User } from '../../shared/models/users.model';

@Component({
  selector: 'app-first-login',
  standalone: true,
  imports: [
    InputComponent, 
    ButtonComponent, 
    ReactiveFormsModule, 
    LoadingComponent, 
    CommonModule, 
    RouterModule,
  ],
  templateUrl: './first-access.component.html',
  styleUrl: './first-access.component.scss',
  providers: [LoadingService, AuthEntityService]
})
export class FirstAccessComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userEntityService = inject(UserEntityService);
  private readonly termsService = inject(TermsService);
  private readonly loadingService = inject(LoadingService);

  private readonly errorMessageSubject = new BehaviorSubject<string | null>(null);
  readonly errorMessage$ = this.errorMessageSubject.asObservable();

  private token = localStorage.getItem('authToken');
  private userId = this.activatedRoute.snapshot.paramMap.get('id');

  firstAccessForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    telephone: ['', [
      Validators.required, 
      Validators.pattern(/^\([1-9]{2}\) (?:9[1-9]|[2-8])[0-9]{3}-[0-9]{4}$/)
    ]],
    email: ['', [Validators.email]],
    password: ['', [
      Validators.required, 
      Validators.minLength(8),
      passwordStrengthValidator()
    ]],
    password_confirmation: ['', [Validators.required]]
  }, { validators: passwordMatchValidator() });

  get username() { return this.firstAccessForm.get('username'); }
  get telephone() { return this.firstAccessForm.get('telephone'); }
  get email() { return this.firstAccessForm.get('email'); }
  get password() { return this.firstAccessForm.get('password'); }
  get passwordConfirmation() { return this.firstAccessForm.get('password_confirmation'); }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    if (!this.userId) {
      this.errorMessageSubject.next('ID do usuário não encontrado.');
      return;
    }

    const currentUser = this.userEntityService.getCurrentUser();
    if (currentUser) {
      this.populateForm(currentUser);
    }
  }

  private populateForm(user: User): void {
    if (!user) return;

    const formControls = {
      username: user.username || '',
      telephone: user.telephone || '',
      email: user.email || '',
    };

    Object.keys(formControls).forEach(key => {
      const control = this.firstAccessForm.get(key);
      if (control && formControls[key as keyof typeof formControls]) {
        control.setValue(formControls[key as keyof typeof formControls]);
        if (key !== 'email') { // Email é opcional
          control.markAsTouched();
        }
      }
    });
  }

  onSubmit(): void {
    if (this.firstAccessForm.invalid) {
      this.markFormAsTouched();
      this.errorMessageSubject.next('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    if (!this.token || !this.userId) {
      this.errorMessageSubject.next('Sessão expirada. Por favor, faça login novamente.');
      return;
    }

    const formValues = encodePasswordFields(this.firstAccessForm.getRawValue(), [
      'password',
      'password_confirmation',
    ]);

    const updateData: User = {
      id: Number(this.userId),
      ...formValues,
      first_access: false
    };

    this.updateUser(updateData);
  }

  private markFormAsTouched(): void {
    Object.keys(this.firstAccessForm.controls).forEach(key => {
      this.firstAccessForm.get(key)?.markAsTouched();
    });
  }

  private updateUser(updateData: User): void {
    this.loadingService.loadingOn();
    this.userEntityService.update(updateData).pipe(
      tap(() => {
        this.errorMessageSubject.next(null);
        this.showSuccessMessage();
        this.navigateToOnboarding();
      }),
      catchError((err: HttpErrorResponse) => {
        this.errorMessageSubject.next(err.error?.message || 'Erro inesperado.');
        return of(null);
      }),
      finalize(() => this.loadingService.loadingOff())
    ).subscribe();
  }

  private showSuccessMessage(): void {
    Swal.fire({
      title: 'Sucesso!',
      text: 'Usuário atualizado com sucesso',
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }

  private navigateToOnboarding(): void {
    this.router.navigateByUrl('/on-boarding');
  }

  showTermsOfUse(): void {
    this.termsService.showTermsOfUse();
  }

  showPrivacyPolicy(): void {
    this.termsService.showPrivacyPolicy();
  }
}
