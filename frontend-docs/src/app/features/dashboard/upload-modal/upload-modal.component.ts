import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DocumentService } from '../../../core/api/document.service';

@Component({
  selector: 'app-upload-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.css'],
})
export class UploadModalComponent {
  /**
   * Evento de cierre.
   * Emite `true` cuando se sube correctamente, `false` si se cancela o cierra.
   */
  @Output() closed = new EventEmitter<boolean>();

  file: File | null = null;
  title = '';
  isLoading = false;

  constructor(private documentService: DocumentService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }

  upload(): void {
    if (!this.file || !this.title) return;

    this.isLoading = true;
    this.documentService.uploadDocument(this.file, this.title).subscribe({
      next: () => {
        this.isLoading = false;
        this.closed.emit(true); // cierra notificando éxito
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  /** Cierra modal (sin subir) */
  close(): void {
    this.closed.emit(false);
  }
}
