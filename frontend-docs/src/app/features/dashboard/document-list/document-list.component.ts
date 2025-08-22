import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../../core/api/document.service';
import { Document } from '../../../models/document.model';
import { UploadButtonComponent } from '../upload-button/upload-button.component';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, UploadButtonComponent],
  templateUrl: './document-list.component.html',
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  loading = false;
  error: string | null = null;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    this.loading = true;
    this.error = null;
    this.documentService.listDocuments().subscribe({
      next: (data: Document[]) => {
        this.documents = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar documentos';
        this.loading = false;
      },
    });
  }
}
