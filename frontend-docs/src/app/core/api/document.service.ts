import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Document } from '../../models/document.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  listDocuments() {
    return this.http.get<Document[]>(`${this.apiUrl}/list/`);
  }

  uploadDocument(file: File, title: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    return this.http.post<Document>(`${this.apiUrl}/upload/`, formData);
  }

  searchWithAI(prompt: string) {
    return this.http.post<{ result: string }>(`${this.apiUrl}/search/`, { prompt });
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post<{ access: string; refresh: string }>(`${this.apiUrl}/login/`, credentials);
  }

  refresh(refreshToken: string) {
    return this.http.post<{ access: string }>(`${this.apiUrl}/refresh/`, {
      refresh: refreshToken,
    });
  }
}
