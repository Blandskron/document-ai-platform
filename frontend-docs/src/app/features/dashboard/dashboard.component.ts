import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { AiSearchComponent } from './ai-search/ai-search.component';
import { UploadButtonComponent } from '../dashboard/upload-button/upload-button.component';
import { UploadModalComponent } from '../dashboard/upload-modal/upload-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, DocumentListComponent, AiSearchComponent, UploadButtonComponent, UploadModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  documents: any[] = [];
  aiResponse: string | null = null;
  aiMode = false;

  username = localStorage.getItem('username') || 'User';
  menuOpen = false;
  showUpload = false;

  constructor(private router: Router, private http: HttpClient) {
    this.loadDocuments();
  }

  loadDocuments() {
    const token = localStorage.getItem('token');
    this.http
      .get<any[]>('/api/documents/list/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (docs) => (this.documents = docs),
        error: () => (this.documents = []),
      });
  }

  onSearch(query: string) {
    const token = localStorage.getItem('token');
    if (this.aiMode) {
      this.http
        .get<{ answer: string }>(`/api/documents/search/?q=${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe({
          next: (res) => (this.aiResponse = res.answer),
          error: () => (this.aiResponse = `Respuesta IA simulada para: ${query}`),
        });
    } else {
      this.http
        .get<any[]>(`/api/documents/list/?q=${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe({
          next: (docs) => (this.documents = docs),
          error: () => (this.documents = []),
        });
    }
  }

  toggleAiMode() {
    this.aiMode = !this.aiMode;
    this.aiResponse = null;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  openUploadModal() {
    this.showUpload = true;
  }

  handleClose(event: any) {
    this.showUpload = false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
