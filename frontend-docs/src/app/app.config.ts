import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor de autenticación
 * Agrega el token de acceso en cada request HTTP (si existe en localStorage).
 */
const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access'); // usamos "access" porque tu backend entrega access y refresh
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // Configuración de HttpClient con interceptor global
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
