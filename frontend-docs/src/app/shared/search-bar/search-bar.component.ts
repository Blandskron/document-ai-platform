import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <input
      [(ngModel)]="query"
      (input)="onInput()"
      placeholder="Buscar..."
      class="border p-2 w-full" />
  `,
})
export class SearchBarComponent {
  query = '';
  @Output() search = new EventEmitter<string>();

  onInput() {
    this.search.emit(this.query);
  }
}
