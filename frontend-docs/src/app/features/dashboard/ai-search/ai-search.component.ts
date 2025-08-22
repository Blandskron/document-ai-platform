import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-search',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border p-4 bg-gray-100">
      <h3 class="font-bold mb-2">Resultado IA</h3>
      <p>{{ response }}</p>
    </div>
  `,
})
export class AiSearchComponent {
  @Input() response: string | null = null;
}
