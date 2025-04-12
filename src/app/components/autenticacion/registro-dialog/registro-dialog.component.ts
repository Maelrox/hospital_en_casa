import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-registro-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './registro-dialog.component.html',
  styleUrls: ['./registro-dialog.component.css']
})
export class RegistroDialogComponent {
  registroForm: FormGroup;
  errorMessage: string = '';

  tiposUsuario = [
    { value: 'Paciente', viewValue: 'Paciente' },
    { value: 'Médico', viewValue: 'Médico' },
    { value: 'Familiar', viewValue: 'Familiar' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistroDialogComponent>,
    private authService: AuthService
  ) {
    this.registroForm = this.fb.group({
      tipo_usuario: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.maxLength(100)]],
      documento_identidad: ['', [Validators.required, Validators.maxLength(20)]],
      direccion: ['', Validators.maxLength(255)],
      telefono: ['', [Validators.maxLength(20), Validators.pattern('^[0-9+()-]*$')]],
      correo_electronico: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      nombre_usuario: ['', [Validators.required, Validators.maxLength(50)]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      confirmar_contraseña: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('contraseña')?.value;
    const confirmPassword = control.get('confirmar_contraseña')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.registroForm.valid) {
      const { confirmar_contraseña, ...usuarioData } = this.registroForm.value;
      this.authService.register(usuarioData).subscribe({
        next: (usuario) => {
          console.log('Usuario registrado:', usuario);
          this.dialogRef.close(usuario);
        },
        error: (error) => {
          this.errorMessage = 'Error al registrar el usuario';
          console.error('Registration error:', error);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 