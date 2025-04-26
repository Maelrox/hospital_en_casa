import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialClinico } from '../interfaces/registros-medicos.interface';
import { AuthContextService } from '../auth/auth-context.service';

@Injectable({
  providedIn: 'root'
})
export class HistorialClinicoService {
  private apiUrl = `${environment.apiUrl}/historialesclinicos`;

  constructor(
    private http: HttpClient,
    private authContext: AuthContextService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authContext.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerTodos(): Observable<HistorialClinico[]> {
    return this.http.get<HistorialClinico[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  obtenerPorId(id: number): Observable<HistorialClinico> {
    return this.http.get<HistorialClinico>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  crear(historial: HistorialClinico): Observable<HistorialClinico> {
    return this.http.post<HistorialClinico>(this.apiUrl, historial, { headers: this.getHeaders() });
  }

  actualizar(id: number, historial: HistorialClinico): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, historial, { headers: this.getHeaders() });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
} 