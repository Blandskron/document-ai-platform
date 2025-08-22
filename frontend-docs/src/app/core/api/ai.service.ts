import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';

export interface AiSearchResponse {
  query: string;
  result: string;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  search(query: string): Observable<AiSearchResponse> {
    const token = localStorage.getItem('token') || '';
    const params = new HttpParams().set('q', query);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<AiSearchResponse>(`${this.apiUrl}/search/`, { params, headers });
    // Endpoint esperado: GET {apiUrl}/search/?q=...
  }
}
