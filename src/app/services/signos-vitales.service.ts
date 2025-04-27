import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignosVitales } from '../interfaces/registros-medicos.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignosVitalesService {
  private apiUrl = `${environment.apiUrl}/signosvitales`;

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<SignosVitales[]> {
    return this.http.get<SignosVitales[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<SignosVitales> {
    return this.http.get<SignosVitales>(`${this.apiUrl}/${id}`);
  }

  crear(signosVitales: SignosVitales): Observable<SignosVitales> {
    return this.http.post<SignosVitales>(this.apiUrl, signosVitales);
  }

  actualizar(id: number, signosVitales: SignosVitales): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, signosVitales);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 