import { Component, inject } from '@angular/core';
import { InputComponent } from '../../shared/components/input/input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LoadingService } from '../../shared/services/loading.service';
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { encodePasswordFields, passwordMatchValidator } from '../../shared/utils/validators/password.validator';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-first-login',
  standalone: true,
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule, LoadingComponent, CommonModule, RouterModule],
  templateUrl: './first-access.component.html',
  styleUrl: './first-access.component.scss',
  providers: [LoadingService, AuthService]
})
export class FirstLoginComponent {
  firstAccessForm: FormGroup = new FormGroup({});
  passwordFieldType: string = 'password';

  errorMessage = new BehaviorSubject<string | null>(null);
  successMessage = new BehaviorSubject<string | null>(null);

  errorMessage$ = this.errorMessage.asObservable();
  successMessage$ = this.successMessage.asObservable();

  private token: string | null = '';
  private userId: string | null = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  private loadingService = inject(LoadingService);

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');

    this.initForm();
  }

  public initForm() {
    this.firstAccessForm = this.fb.group({
      username: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]]
    }, { validators: passwordMatchValidator() });
  }

  onSubmit(): void {
    if (this.firstAccessForm.valid && this.token && this.userId) {
      const formValues = encodePasswordFields(this.firstAccessForm.getRawValue(), [
        'password',
        'password_confirmation',
      ]);

      const payload = {
        ...formValues
      }

      const auth$ = this.userService.updateUser(
        payload,
        this.userId
      )

      this.loadingService.showLoaderUntilCompleted(auth$)
        .subscribe({
          next: (res: any) => {
            localStorage.setItem('currentUser', JSON.stringify(res.data));
            this.errorMessage.next(null);
            this.router.navigateByUrl('on-boarding');
            this.successMessage.next(res.message)
          },
          error: (err: any) => {
            this.errorMessage.next(err.error?.message || 'Erro inesperado.')
          }
        });
    }
  }
}
