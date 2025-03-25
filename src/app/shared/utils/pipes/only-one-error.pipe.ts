import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'onlyOneError',
  standalone: true
})
export class OnlyOneErrorPipe implements PipeTransform {

  transform(errors: { [key: string]: any }): string | null {
    if (!errors) {
      return null;
    }

    const errorKey = Object.keys(errors)[0];
    const errorMessage = this.getError(errorKey);
    return errorMessage;
  }

  private getError(errorKey: string): string {
    switch (errorKey) {
      case 'required':
        return 'Este campo é obrigatório';
      case 'email':
        return 'Formato de e-mail inválido';
      case 'pattern':
        return 'Formato inválido';
      case 'passwordMismatch':
        return 'As senhas não correspondem';
      default:
        return 'Valor inválido';
    }
  }

}
