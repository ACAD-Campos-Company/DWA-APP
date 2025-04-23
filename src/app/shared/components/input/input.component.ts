import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, AfterContentInit, OnChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { OnlyOneErrorPipe } from '../../utils/pipes/only-one-error.pipe';
import { PasswordStrengthComponent } from '../password-strength/password-strength.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    NgxMaskDirective, 
    OnlyOneErrorPipe,
    PasswordStrengthComponent
  ],
  providers: [provideNgxMask()],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements AfterContentInit, OnChanges {
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() type: string = 'text';
  @Input() mask: string = '';
  @Input() options: any[] | null = [];
  @Input() addIcon: boolean = false;
  @Input() control: FormControl = new FormControl();
  @Input() containerClass: string = '';
  @Input() inputClass: string = '';
  @Input() labelClass: string = '';
  @Input() borderless: boolean = false;
  @Input() showPasswordStrength: boolean = false;
  @Input() showMaskTyped: boolean = false;
  @Input() dropSpecialCharacters: boolean = true;

  @Output() input = new EventEmitter();

  showPassword: boolean = false;

  ngAfterContentInit(): void {
    if (this.mask) this.type = 'text';
  }

  ngOnChanges(changes: any): void {
    if (changes.formControl?.currentValue) {
      this.control.setValue(changes.formControl.currentValue);
    }
  }

  onInput($event: any): void {
    this.input.emit($event);
  }

  valid(): boolean {
    return this.control.errors == null;
  }
}
