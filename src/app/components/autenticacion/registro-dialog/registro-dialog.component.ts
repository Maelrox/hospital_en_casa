import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../services/toast.service';
import { Paciente } from '../../../interfaces/paciente.interface';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: DateAdapter, useClass: NativeDateAdapter, deps: [MAT_DATE_LOCALE] }
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
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.registroForm = this.fb.group({
      tipoUsuario: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.maxLength(100)]],
      documentoIdentidad: ['', [Validators.required, Validators.maxLength(20)]],
      direccion: ['', Validators.maxLength(255)],
      telefono: ['', [Validators.maxLength(20), Validators.pattern('^[0-9+()-]*$')]],
      correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      nombreUsuario: ['', [Validators.required, Validators.maxLength(50)]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContraseña: ['', Validators.required],
      // Patient specific fields
      fechaNacimiento: [''],
      sexo: [''],
      tipoSangre: [''],
      alergias: [''],
      antecedentes: [''],
      direccionResidencia: [''],
      contactoEmergencia: [''],
      parentescoContacto: [''],
      telefonoEmergencia: ['']
    }, { validator: this.passwordMatchValidator });

    // Add validators for patient fields when tipoUsuario is 'Paciente'
    this.registroForm.get('tipoUsuario')?.valueChanges.subscribe(tipo => {
      const isPaciente = tipo === 'Paciente';
      const patientFields = [
        'fechaNacimiento',
        'sexo',
        'direccionResidencia',
        'contactoEmergencia',
        'parentescoContacto',
        'telefonoEmergencia'
      ];

      patientFields.forEach(field => {
        const control = this.registroForm.get(field);
        if (isPaciente) {
          control?.setValidators([Validators.required]);
        } else {
          control?.clearValidators();
        }
        control?.updateValueAndValidity();
      });
    });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('contraseña')?.value;
    const confirmPassword = control.get('confirmarContraseña')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  get isPaciente(): boolean {
    return this.registroForm.get('tipoUsuario')?.value === 'Paciente';
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.registroForm.valid) {
      const formValue = this.registroForm.value;
      const { confirmarContraseña, tipoUsuario, ...usuarioData } = formValue;
      
      // Add tipoUsuario back to the user data
      const usuarioDataWithTipo = {
        ...usuarioData,
        tipoUsuario: tipoUsuario
      };

      this.authService.register(usuarioDataWithTipo).subscribe({
        next: (usuario) => {
          if (tipoUsuario === 'Paciente' && usuario) {
            // Crear paciente
            const pacienteData: Paciente = {
              idPaciente: 0,
              idUsuario: usuario.idUsuario,
              fechaNacimiento: formValue.fechaNacimiento,
              sexo: formValue.sexo,
              tipoSangre: formValue.tipoSangre,
              alergias: formValue.alergias,
              antecedentes: formValue.antecedentes,
              direccionResidencia: formValue.direccionResidencia,
              contactoEmergencia: formValue.contactoEmergencia,
              parentescoContacto: formValue.parentescoContacto,
              telefonoEmergencia: formValue.telefonoEmergencia,
              familiares: [],
              signosVitales: []
            };

            // Make the second API call to create the patient
            this.authService.createPatient(pacienteData).subscribe({
              next: () => {
                this.toastService.showSuccess('Usuario y datos del paciente registrados correctamente');
                this.dialogRef.close(usuario);
              },
              error: (error) => {
                console.error('Error al crear paciente:', error);
                this.errorMessage = 'Error al registrar la información del paciente';
              }
            });
          } else {
            this.toastService.showSuccess('Usuario registrado correctamente');
            this.dialogRef.close(usuario);
          }
        },
        error: (error) => {
          this.errorMessage = 'Error al registrar el usuario';
          console.error('Registration error:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 