import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule, LoadingComponent, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [AuthService, LoadingService],
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({});
  errorMessageSubject = new BehaviorSubject<string | null>(null);

  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  private loadingService = inject(LoadingService);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      document: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formValues = { ...this.loginForm.getRawValue() };

      const encodedPassword = btoa(formValues.password);
      formValues.password = encodedPassword;

      const auth$ = this.authService.authenticate(formValues);

      this.loadingService.showLoaderUntilCompleted(auth$).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.data.token);

          if (!res.data.user.last_login) {
            this.router.navigateByUrl(`/first-access/${res.data.user.id}`);
          } else {
            localStorage.setItem('currentUser', JSON.stringify(res.data.user));
            this.router.navigateByUrl('/on-boarding');
          }
        },
        error: (err) => {
          this.errorMessageSubject.next(err.error.message || "Erro inesperado");
        },
      });

      this.authService.login();
    }
  }

}
