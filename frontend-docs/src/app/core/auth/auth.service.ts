import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(username: string, password: string) {
    return this.http.post<{ access: string; refresh: string }>(`${environment.apiUrl}/login/`, { username, password }).pipe(
      tap((tokens) => {
        this.accessToken = tokens.access;
        this.refreshToken = tokens.refresh;
        if (this.isBrowser()) {
          localStorage.setItem('access', tokens.access);
          localStorage.setItem('refresh', tokens.refresh);
        }
      })
    );
  }

  getAccessToken(): string | null {
    if (this.accessToken) return this.accessToken;
    if (this.isBrowser()) return localStorage.getItem('access');
    return null;
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    if (this.isBrowser()) {
      localStorage.clear();
    }
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}
