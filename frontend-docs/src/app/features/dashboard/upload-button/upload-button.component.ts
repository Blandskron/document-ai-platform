import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UploadModalComponent } from '../upload-modal/upload-modal.component';

@Component({
  selector: 'app-upload-button',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.css'],
})
export class UploadButtonComponent {
  constructor(private dialog: MatDialog) {}

  openUploadModal(): void {
    const dialogRef = this.dialog.open(UploadModalComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // 🔄 Aquí puedes refrescar documentos si lo deseas
      }
    });
  }
}
