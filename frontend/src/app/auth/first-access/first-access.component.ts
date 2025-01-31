import { Component } from '@angular/core';
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

@Component({
  selector: 'app-first-login',
  standalone: true,
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule, LoadingComponent, CommonModule, RouterModule],
  templateUrl: './first-access.component.html',
  styleUrl: './first-access.component.scss',
  providers: [LoadingService]
})
export class FirstLoginComponent {
  firstLoginForm: FormGroup = new FormGroup({});
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
    private router: Router,
    private loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');

    this.initForm();
  }

  public initForm() {
    this.firstLoginForm = this.fb.group({
      name: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]]
    }, { validators: passwordMatchValidator() });
  }

  onSubmit(): void {
    if (this.firstLoginForm.valid && this.token && this.userId) {
      const formValues = encodePasswordFields(this.firstLoginForm.getRawValue(), [
        'password',
        'password_confirmation',
      ]);

      const payload = {
        ...formValues
      }

      const auth$ = this.userService.updateUser(
        payload,
        this.token,
        this.userId
      )

      this.loadingService.showLoaderUntilCompleted(auth$)
        .subscribe({
          next: (res) => {
            this.errorMessage.next(null);
            this.router.navigateByUrl('on-boarding');
            this.successMessage.next(res.message)
          },
          error: (err) => {
            this.errorMessage.next(err.error?.message || 'Erro inesperado.')
          }
        });
    }
  }
}
