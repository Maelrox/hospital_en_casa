import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SugerenciaCuidado } from '../interfaces/registros-medicos.interface';

@Injectable({
  providedIn: 'root'
})
export class SugerenciasCuidadoService {
  private apiUrl = `${environment.apiUrl}/sugerenciascuidado`;

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<SugerenciaCuidado[]> {
    return this.http.get<SugerenciaCuidado[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<SugerenciaCuidado> {
    return this.http.get<SugerenciaCuidado>(`${this.apiUrl}/${id}`);
  }

  crear(sugerencia: SugerenciaCuidado): Observable<SugerenciaCuidado> {
    return this.http.post<SugerenciaCuidado>(this.apiUrl, sugerencia);
  }

  actualizar(id: number, sugerencia: SugerenciaCuidado): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, sugerencia);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 