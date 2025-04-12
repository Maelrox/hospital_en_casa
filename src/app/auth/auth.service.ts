import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  private usuariosMock: Usuario[] = [
    {
      id_usuario: 1,
      tipo_usuario: 'Paciente',
      nombre: 'Juan',
      apellido: 'Pérez',
      documento_identidad: '12345678',
      correo_electronico: 'juan@example.com',
      nombre_usuario: 'juanperez',
      contraseña: '123456'
    },
    {
      id_usuario: 2,
      tipo_usuario: 'Médico',
      nombre: 'María',
      apellido: 'García',
      documento_identidad: '87654321',
      correo_electronico: 'maria@example.com',
      nombre_usuario: 'mariagarcia',
      contraseña: '123456'
    },
    {
      id_usuario: 3,
      tipo_usuario: 'Familiar',
      nombre: 'Gladys',
      apellido: 'García',
      documento_identidad: '74157910',
      correo_electronico: 'gladys@prueba.com',
      nombre_usuario: 'gladysgarcia',
      contraseña: '123456'
    }
  ];

  constructor(private router: Router, private http: HttpClient) {}

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  login(credenciales: { nombre_usuario: string, contraseña: string }): Observable<Usuario | null> {
    const usuario = this.usuariosMock.find(
      u => u.nombre_usuario === credenciales.nombre_usuario && 
          u.contraseña === credenciales.contraseña
    );
    if (usuario) {
      localStorage.setItem('currentUser', JSON.stringify(usuario));
    }
    return of(usuario || null);
  }

  register(usuarioData: Usuario): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios`, usuarioData).pipe(
      tap(usuario => {
        localStorage.setItem('currentUser', JSON.stringify(usuario));
      })
    );
  }

  getUserById(id: number): Observable<Usuario | null> {
    const usuario = this.usuariosMock.find(u => u.id_usuario === id);
    return of(usuario || null);
  }
} 