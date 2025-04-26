import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Paciente } from '../interfaces/paciente.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5297/api';

  constructor(private router: Router, private http: HttpClient) {}

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  login(credenciales: { nombreUsuario: string, contraseña: string }): Observable<Usuario | null> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios/login`, credenciales).pipe(
      tap(usuario => {
        if (usuario) {
          localStorage.setItem('currentUser', JSON.stringify(usuario));
        }
      })
    );
  }

  register(usuarioData: Usuario, pacienteData?: Paciente): Observable<any> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, usuarioData).pipe(
      tap(usuario => {
        if (usuario && pacienteData && usuario.idUsuario) {
          // If patient data is provided, create the patient record
          pacienteData.idUsuario = usuario.idUsuario;
          this.http.post<Paciente>(`${this.apiUrl}/pacientes`, pacienteData).subscribe();
        }
        localStorage.setItem('currentUser', JSON.stringify(usuario));
      })
    );
  }

  createPatient(pacienteData: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.apiUrl}/pacientes`, pacienteData);
  }

  /*getUserById(id: number): Observable<Usuario | null> {
    resolve undefined;
  }*/
} 