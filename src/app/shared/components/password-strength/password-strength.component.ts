import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { checkPasswordRequirements } from '../../utils/validators/password.validator';

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password-strength.component.html',
  styleUrl: './password-strength.component.scss'
})
export class PasswordStrengthComponent implements OnChanges {
  @Input() public password = '';
  @Input() public showMessages = true;


  hasUpperCaseError = true;
  hasLowerCaseError = true;
  hasNumericError = true;
  hasSpecialCharError = true;
  hasMinLengthError = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['password']) {

      this.checkPasswordErrors(this.password);
    }
  }

  hasPasswordError(): boolean {
    return this.hasUpperCaseError || this.hasLowerCaseError || this.hasNumericError 
      || this.hasSpecialCharError || this.hasMinLengthError;
  }

  private checkPasswordErrors(password: string): void {
    if (!password) {
      this.resetErrors();
      return;
    }

    const passwordCheck = checkPasswordRequirements(password);
    
    this.hasUpperCaseError = !passwordCheck.hasUpperCase;
    this.hasLowerCaseError = !passwordCheck.hasLowerCase;
    this.hasNumericError = !passwordCheck.hasNumeric;
    this.hasSpecialCharError = !passwordCheck.hasSpecialChar;
    this.hasMinLengthError = !passwordCheck.minLength;
  }

  private resetErrors(): void {
    this.hasUpperCaseError = true;
    this.hasLowerCaseError = true;
    this.hasNumericError = true;
    this.hasSpecialCharError = true;
    this.hasMinLengthError = true;
  }
} 