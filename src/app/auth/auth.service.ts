import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Paciente } from '../interfaces/paciente.interface';
import { Medico } from '../interfaces/medico.interface';
import { Familiar } from '../interfaces/familiar.interface';
import { environment } from '../../environments/environment';

/*
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = `${environment.apiUrl}/pacientes`;

*/
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
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

  createMedico(medicoData: Medico): Observable<Medico> {
    return this.http.post<Medico>(`${this.apiUrl}/medicos`, medicoData);
  }

  createFamiliar(familiarData: Familiar): Observable<Familiar> {
    return this.http.post<Familiar>(`${this.apiUrl}/familiares`, familiarData);
  }

  getAllPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/pacientes`);
  }

  searchPacientes(searchTerm: string): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/pacientes/search?term=${searchTerm}`);
  }

} 