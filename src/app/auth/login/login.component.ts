import { Component, inject, OnInit } from '@angular/core';
import { InputComponent } from '../../shared/components/input/input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../../shared/services/auth.service';
import { LoadingService } from '../../shared/services/loading.service';
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppState } from '../../reducers';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule, LoadingComponent, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [AuthService, LoadingService],
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);

  private readonly errorMessageSubject = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessageSubject.asObservable();
  loginForm: FormGroup = new FormGroup({});

  constructor() { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      document: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formValues = { ...this.loginForm.getRawValue() };

      formValues.password = btoa(formValues.password);

      const auth$ = this.authService.authenticate(formValues);

      this.loadingService.showLoaderUntilCompleted(auth$).subscribe({
        next: ({ data: { user, token } }) => {
          localStorage.setItem('token', token);

          if (!user.last_login) {
            this.router.navigateByUrl(`/first-access/${user.id}`);
          } else {
            this.router.navigateByUrl('/on-boarding');
          }
        },
        error: (err) => {
          this.errorMessageSubject.next(err.error.message || "Erro inesperado");
        },
      });
    }
  }
}
