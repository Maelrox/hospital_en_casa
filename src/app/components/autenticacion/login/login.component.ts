import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RegistroDialogComponent } from '../registro-dialog/registro-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      nombre_usuario: ['', Validators.required],
      contraseña: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (usuario) => {
          if (usuario) {
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Credenciales inválidas';
          }
        },
        error: (error) => {
          this.errorMessage = 'Error al iniciar sesión';
          console.error('Login error:', error);
        }
      });
    }
  }

  openRegisterDialog(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const dialogRef = this.dialog.open(RegistroDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
} 