import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RegistroDialogComponent } from '../registro-dialog/registro-dialog.component';
import { AdminPasswordDialogComponent } from '../registro-dialog/admin-password-dialog/admin-password-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';
import { AuthContextService } from '../../../auth/auth-context.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [HttpClient],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  private readonly ADMIN_PASSWORD = 'admin123';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private toastService: ToastService,
    private authContext: AuthContextService
  ) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contraseña: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response && response.token) {
            this.authContext.setAuthContext(response);
            this.router.navigate(['/home']);
          } else {
            this.toastService.showError('Error al iniciar sesión');
          }
        },
        error: (error) => {
          this.toastService.showError('Credenciales inválidas');
          console.error('Login error:', error);
        }
      });
    }
  }

  async openRegisterDialog(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const adminDialogRef = this.dialog.open(AdminPasswordDialogComponent, {
      width: '400px',
      disableClose: true
    });

    const adminPassword = await adminDialogRef.afterClosed().toPromise();
    
    if (adminPassword === this.ADMIN_PASSWORD) {
      const dialogRef = this.dialog.open(RegistroDialogComponent, {
        width: '960px'
      });
    } else if (adminPassword) {
      this.toastService.showError('Contraseña de administrador incorrecta');
    }
  }
} 