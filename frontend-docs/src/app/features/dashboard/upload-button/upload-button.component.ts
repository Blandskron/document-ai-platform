import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.css'],
})
export class UploadButtonComponent {
  @Output() clicked = new EventEmitter<void>();

  open() {
    this.clicked.emit();
  }
}
