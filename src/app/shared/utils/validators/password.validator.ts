import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Constantes para validação de senha
export const PASSWORD_PATTERNS = {
  UPPERCASE: /[A-Z]+/,
  LOWERCASE: /[a-z]+/,
  NUMERIC: /[0-9]+/,
  SPECIAL_CHAR: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
  MIN_LENGTH: 8
};

export interface PasswordCheck {
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumeric: boolean;
  hasSpecialChar: boolean;
  minLength: boolean;
  isValid: boolean;
}

export function checkPasswordRequirements(password: string): PasswordCheck {
  if (!password) {
    return {
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumeric: false,
      hasSpecialChar: false,
      minLength: false,
      isValid: false
    };
  }

  const hasUpperCase = PASSWORD_PATTERNS.UPPERCASE.test(password);
  const hasLowerCase = PASSWORD_PATTERNS.LOWERCASE.test(password);
  const hasNumeric = PASSWORD_PATTERNS.NUMERIC.test(password);
  const hasSpecialChar = PASSWORD_PATTERNS.SPECIAL_CHAR.test(password);
  const minLength = password.length >= PASSWORD_PATTERNS.MIN_LENGTH;
  
  const isValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && minLength;
  
  return {
    hasUpperCase,
    hasLowerCase,
    hasNumeric,
    hasSpecialChar,
    minLength,
    isValid
  };
}

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const check = checkPasswordRequirements(value);
    
    return !check.isValid ? {
      passwordStrength: {
        hasUpperCase: check.hasUpperCase,
        hasLowerCase: check.hasLowerCase,
        hasNumeric: check.hasNumeric,
        hasSpecialChar: check.hasSpecialChar,
        minLength: check.minLength
      }
    } : null;
  };
}

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('password_confirmation');

    if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
      return null;
    }

    if (confirmPassword.errors && 'passwordMismatch' in confirmPassword.errors) {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];
      
      confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
    }

    if (password.value !== confirmPassword.value) {
      const confirmErrors = confirmPassword.errors || {};
      confirmPassword.setErrors({ 
        ...confirmErrors, 
        passwordMismatch: true 
      });
      
      return { passwordMismatch: true };
    }

    return null;
  };
}

export function encodePasswordFields<T extends Record<string, any>>(
  formValues: T,
  fieldsToEncode: (keyof T)[]
): T {
  const updatedValues = { ...formValues };

  fieldsToEncode.forEach((field) => {
    const value = updatedValues[field];

    if (typeof value === 'string') {
      updatedValues[field] = btoa(value) as T[keyof T];
    }
  });

  return updatedValues;
}




