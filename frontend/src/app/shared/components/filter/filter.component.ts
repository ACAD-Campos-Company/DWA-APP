import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Input() placeholder: string = 'Search...';
  @Input() debounceTime: number = 300;
  @Output() filterChanged = new EventEmitter<string>();

  filterControl = new FormControl('');

  ngOnInit(): void {
    this.filterControl.valueChanges
      .pipe(debounceTime(this.debounceTime))
      .subscribe((value) => {
        this.filterChanged.emit(value || '');
      });
  }
}
