import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AiService {
  search(query: string): string {
    return `Respuesta simulada de IA para la consulta: "${query}"`;
  }
}
