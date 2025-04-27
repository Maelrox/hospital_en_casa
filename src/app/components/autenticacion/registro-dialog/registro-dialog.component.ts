import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../services/toast.service';
import { Paciente } from '../../../interfaces/paciente.interface';
import { Medico } from '../../../interfaces/medico.interface';
import { Familiar } from '../../../interfaces/familiar.interface';
import { Usuario } from '../../../interfaces/usuario.interface';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthContextService } from '../../../auth/auth-context.service';
import { Router } from '@angular/router';
import { PacienteService } from '../../../services/paciente.service';
import { firstValueFrom } from 'rxjs';

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
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: DateAdapter, useClass: NativeDateAdapter, deps: [MAT_DATE_LOCALE] }
  ],
  templateUrl: './registro-dialog.component.html',
  styleUrls: ['./registro-dialog.component.css']
})
export class RegistroDialogComponent implements OnInit {
  registroForm: FormGroup;
  errorMessage: string = '';
  selectedPaciente: Paciente | null = null;
  private pacientesSubject = new BehaviorSubject<Paciente[]>([]);
  filteredPacientes: Paciente[] = [];
  pacienteSearchTerm: string = '';
  showAdminPassword: boolean = false;
  private readonly ADMIN_PASSWORD = 'admin123'; // This should be moved to environment variables in production

  tiposUsuario = [
    { value: 'Paciente', viewValue: 'Paciente' },
    { value: 'Medico', viewValue: 'Medico' },
    { value: 'Familiar', viewValue: 'Familiar' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistroDialogComponent>,
    private authService: AuthService,
    private toastService: ToastService,
    private dialog: MatDialog,
    private authContext: AuthContextService,
    private router: Router,
    private pacienteService: PacienteService
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
      // Campos para paciente
      fechaNacimiento: [''],
      sexo: [''],
      tipoSangre: [''],
      alergias: [''],
      antecedentes: [''],
      direccionResidencia: [''],
      contactoEmergencia: [''],
      parentescoContacto: [''],
      telefonoEmergencia: [''],
      // Campos para médico
      especialidad: [''],
      numeroLicencia: [''],
      registroProfesional: [''],
      aniosExperiencia: [0],
      // Campos para familiar
      idPaciente: [''],
      parentesco: [''],
      autorizadoRegistroSignos: [false]
    }, { validator: this.passwordMatchValidator });

    // Listen for tipoUsuario changes to update validation
    this.registroForm.get('tipoUsuario')?.valueChanges.subscribe(tipoUsuario => {
      this.updateValidationForUserType(tipoUsuario);
    });
  }

  ngOnInit() {
    // Obtener lista de pacientes al inicializar
    this.loadPacientes();
  }

  filterPacientes() {
    const term = this.pacienteSearchTerm.toLowerCase();
    const pacientes = this.pacientesSubject.value;

    let filtered = pacientes;
    if (term) {
      filtered = pacientes.filter(paciente =>
      (paciente.usuario?.nombre?.toLowerCase().includes(term) ||
        paciente.usuario?.apellido?.toLowerCase().includes(term) ||
        paciente.usuario?.documentoIdentidad?.toLowerCase().includes(term))
      );
    }

    this.filteredPacientes = filtered.sort((a, b) => {
      const nameA = `${a.usuario?.nombre || ''} ${a.usuario?.apellido || ''}`.toLowerCase();
      const nameB = `${b.usuario?.nombre || ''} ${b.usuario?.apellido || ''}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  onPacienteSelected(paciente: Paciente) {
    this.selectedPaciente = paciente;
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('contraseña')?.value;
    const confirmPassword = control.get('confirmarContraseña')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  get isPaciente(): boolean {
    return this.registroForm.get('tipoUsuario')?.value === 'Paciente';
  }

  get isMedico(): boolean {
    return this.registroForm.get('tipoUsuario')?.value === 'Medico';
  }

  get isFamiliar(): boolean {
    return this.registroForm.get('tipoUsuario')?.value === 'Familiar';
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.registroForm.valid) {
      const formValue = this.registroForm.value;
      const { confirmarContraseña, tipoUsuario, ...usuarioData } = formValue;

      const usuarioDataWithTipo: Usuario = {
        ...usuarioData,
        tipoUsuario: tipoUsuario
      };

      this.authService.register(usuarioDataWithTipo).subscribe({
        next: (usuario) => {
          if (tipoUsuario === 'Paciente' && usuario) {
            const pacienteData: Paciente = {
              idPaciente: 0,
              idUsuario: usuario.idUsuario!,
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
          } else if (tipoUsuario === 'Medico' && usuario) {
            const medicoData: Medico = {
              idMedico: 0,
              idUsuario: usuario.idUsuario!,
              especialidad: formValue.especialidad,
              numeroLicencia: formValue.numeroLicencia,
              registroProfesional: formValue.registroProfesional,
              aniosExperiencia: formValue.aniosExperiencia
            };

            this.authService.createMedico(medicoData).subscribe({
              next: () => {
                this.toastService.showSuccess('Usuario y datos del médico registrados correctamente');
                this.dialogRef.close(usuario);
              },
              error: (error) => {
                console.error('Error al crear médico:', error);
                this.errorMessage = 'Error al registrar la información del médico';
              }
            });
          } else if (tipoUsuario === 'Familiar' && usuario && this.selectedPaciente) {
            const familiarData: Familiar = {
              idUsuario: usuario.idUsuario!,
              idPaciente: this.selectedPaciente.idPaciente,
              parentesco: formValue.parentesco,
              autorizadoRegistroSignos: formValue.autorizadoRegistroSignos,
            };

            this.authService.createFamiliar(familiarData).subscribe({
              next: () => {
                this.toastService.showSuccess('Usuario y datos del familiar registrados correctamente');
                this.dialogRef.close(usuario);
              },
              error: (error) => {
                console.error('Error al crear familiar:', error);
                this.errorMessage = 'Error al registrar la información del familiar';
              }
            });
          } else {
            this.toastService.showSuccess('Usuario registrado correctamente');
            this.dialogRef.close(usuario);
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          if (error.error && error.error.error) {
            this.toastService.showError(error.error.error);
          } else {
            this.toastService.showError('Error del servidor. Por favor, intente nuevamente más tarde.');
          }
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private updateValidationForUserType(tipoUsuario: string) {
    const controls = this.registroForm.controls;
    Object.keys(controls).forEach(key => {
      if (key !== 'tipoUsuario') {
        controls[key].clearValidators();
        controls[key].updateValueAndValidity();
      }
    });

    controls['nombre'].setValidators([Validators.required, Validators.maxLength(100)]);
    controls['apellido'].setValidators([Validators.required, Validators.maxLength(100)]);
    controls['documentoIdentidad'].setValidators([Validators.required, Validators.maxLength(20)]);
    controls['correoElectronico'].setValidators([Validators.required, Validators.email, Validators.maxLength(100)]);
    controls['nombreUsuario'].setValidators([Validators.required, Validators.maxLength(50)]);
    controls['contraseña'].setValidators([Validators.required, Validators.minLength(6)]);
    controls['confirmarContraseña'].setValidators([Validators.required]);

    if (tipoUsuario === 'Paciente') {
      controls['fechaNacimiento'].setValidators([
        Validators.required,
        this.minimumAgeValidator(1)
      ]);
      controls['sexo'].setValidators([Validators.required]);
      controls['direccionResidencia'].setValidators([Validators.required]);
      controls['contactoEmergencia'].setValidators([Validators.required]);
      controls['parentescoContacto'].setValidators([Validators.required]);
      controls['telefonoEmergencia'].setValidators([Validators.required]);
    } else if (tipoUsuario === 'Medico') {
      controls['especialidad'].setValidators([Validators.required]);
      controls['numeroLicencia'].setValidators([Validators.required]);
      controls['registroProfesional'].setValidators([Validators.required]);
      controls['aniosExperiencia'].setValidators([Validators.required, Validators.min(0)]);
    } else if (tipoUsuario === 'Familiar') {
      controls['idPaciente'].setValidators([Validators.required]);
      controls['parentesco'].setValidators([Validators.required]);
      controls['autorizadoRegistroSignos'].setValidators([Validators.required]);
    }

    Object.keys(controls).forEach(key => {
      controls[key].updateValueAndValidity();
    });
  }

  minimumAgeValidator(minAge: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }

      const birthDate = new Date(control.value);
      const today = new Date();
      const ageInDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));

      return ageInDays >= minAge ? null : { 'minimumAge': { requiredAge: minAge, actualAge: ageInDays } };
    };
  }

  formatDateToUTC(date: Date): string {
    if (!date) return '';
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
  }

  async loadPacientes() {
    try {
      const pacientes = await firstValueFrom(this.pacienteService.getPacientes()) || [];
      this.pacientesSubject.next(pacientes);
      this.filteredPacientes = pacientes;
    } catch (error) {
      console.error('Error loading patients:', error);
      this.toastService.showError('Error al cargar los pacientes');
    }
  }
} 