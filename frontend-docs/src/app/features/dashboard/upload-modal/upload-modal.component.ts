import { Component, EventEmitter, Output, HostListener } from '@angular/core';
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
  @Output() closed = new EventEmitter<boolean>();

  file: File | null = null;
  title = '';
  isLoading = false;

  constructor(private documentService: DocumentService) {}

  @HostListener('window:keydown.escape', ['$event'])
  onEscape(e: KeyboardEvent) {
    e.preventDefault();
    this.close();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      if (!this.title) this.title = this.file.name;
    }
  }

  upload(): void {
    if (!this.file || !this.title || this.isLoading) return;

    this.isLoading = true;
    this.documentService.uploadDocument(this.file, this.title).subscribe({
      next: () => {
        this.isLoading = false;
        this.closed.emit(true);
      },
      error: () => {
        this.isLoading = false;
        this.closed.emit(false);
      },
    });
  }

  close(): void {
    if (this.isLoading) return;
    this.closed.emit(false);
  }
}
