import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthContextService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();
  token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize from localStorage if available
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.tokenSubject.next(user.token);
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  login(credentials: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.setAuthContext(response);
        }
      })
    );
  }

  setAuthContext(user: Usuario) {
    if (!user.token) {
      console.error('No token provided in user object');
      return;
    }

    this.currentUserSubject.next(user);
    this.tokenSubject.next(user.token);
    
    // Store in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  clearAuthContext() {
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    
    // Clear from localStorage
    localStorage.removeItem('currentUser');
  }

  logout(): void {
    this.clearAuthContext();
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    const token = this.tokenSubject.value;
    if (!token) {
      // Try to get from localStorage as fallback
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.token;
      }
    }
    return token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserType(): string {
    return this.currentUserSubject.value?.tipoUsuario || '';
  }
} 