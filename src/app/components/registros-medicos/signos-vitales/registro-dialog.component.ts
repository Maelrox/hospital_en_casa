import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { PacienteService } from '../../../services/paciente.service';
import { Paciente } from '../../../interfaces/paciente.interface';
import { BehaviorSubject } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { AuthContextService } from '../../../auth/auth-context.service';
import { SignosVitalesService } from '../../../services/signos-vitales.service';
import { SignosVitales } from '../../../interfaces/registros-medicos.interface';
import { ToastService } from '../../../services/toast.service';
import { Familiar } from '../../../interfaces/familiar.interface';

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
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './registro-dialog.component.html',
  styleUrls: ['./registro-dialog.component.css']
})
export class RegistroDialogComponent implements OnInit {
  registroForm: FormGroup;
  private pacientesSubject = new BehaviorSubject<Paciente[]>([]);
  filteredPacientes: Paciente[] = [];
  pacienteSearchTerm: string = '';
  selectedPaciente: Paciente | null = null;
  errorMessage: string = '';
  tipoRegistrador: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RegistroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pacienteService: PacienteService,
    private authContext: AuthContextService,
    private signosVitalesService: SignosVitalesService,
    private toastService: ToastService
  ) {
    const currentUser = this.authContext.getCurrentUser();
    this.tipoRegistrador = currentUser?.tipoUsuario?.toLowerCase() || '';
    
    // Get the patient ID based on user type
    let patientId: number | null = null;
    if (this.tipoRegistrador === 'paciente') {
      patientId = currentUser?.idPaciente || null;
    } else if (this.tipoRegistrador === 'familiar') {
      patientId = currentUser?.idPaciente || null;
    }
    
    this.registroForm = this.fb.group({
      idPaciente: [{ value: patientId || '', disabled: this.tipoRegistrador !== 'medico' }, 
        this.tipoRegistrador === 'medico' ? Validators.required : []],
      oximetria: ['', [Validators.required, Validators.min(70), Validators.max(100)]],
      frecuenciaRespiratoria: ['', [Validators.required, Validators.min(8), Validators.max(60)]],
      frecuenciaCardiaca: ['', [Validators.required, Validators.min(40), Validators.max(200)]],
      temperatura: ['', [Validators.required, Validators.min(35), Validators.max(42)]],
      presionArterialSistolica: ['', [Validators.required, Validators.min(70), Validators.max(250)]],
      presionArterialDiastolica: ['', [Validators.required, Validators.min(40), Validators.max(150)]],
      glicemia: ['', [Validators.required, Validators.min(50), Validators.max(500)]],
      tipoRegistrador: [this.tipoRegistrador, Validators.required],
      idRegistrador: [currentUser?.idMedico || currentUser?.idPaciente || currentUser?.idFamiliar || '', Validators.required]
    });

    // If editing, patch the form with existing values
    if (this.data.signosVitales) {
      this.registroForm.patchValue(this.data.signosVitales);
    } else if (patientId) {
      // Ensure patientId is set for non-medico users
      this.registroForm.patchValue({ idPaciente: patientId });
    }
  }

  ngOnInit() {
    if (this.tipoRegistrador === 'medico') {
      this.loadPacientes();
    } else {
      const currentUser = this.authContext.getCurrentUser();
      const patientId = this.tipoRegistrador === 'paciente' 
        ? currentUser?.idPaciente 
        : (currentUser as unknown as Familiar)?.paciente?.idPaciente;

      if (patientId) {
        this.pacienteService.getPacientes().subscribe({
          next: (pacientes: Paciente[]) => {
            const paciente = pacientes.find(p => p.idPaciente === patientId);
            if (paciente) {
              this.pacientesSubject.next([paciente]);
              this.filteredPacientes = [paciente];
            }
          },
          error: (error: any) => {
            console.error('Error loading patient:', error);
            this.toastService.showError('Error al cargar los datos del paciente');
          }
        });
      }
    }
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

  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  filterPacientes() {
    const term = this.normalizeString(this.pacienteSearchTerm);
    const pacientes = this.pacientesSubject.value;
    
    if (!term) {
      this.filteredPacientes = [...pacientes].sort((a, b) => {
        const nameA = this.normalizeString(`${a.usuario?.nombre || ''} ${a.usuario?.apellido || ''}`);
        const nameB = this.normalizeString(`${b.usuario?.nombre || ''} ${b.usuario?.apellido || ''}`);
        return nameA.localeCompare(nameB);
      });
      return;
    }
    
    this.filteredPacientes = pacientes.filter(paciente => {
      const nombreCompleto = this.normalizeString(`${paciente.usuario?.nombre || ''} ${paciente.usuario?.apellido || ''}`);
      const documento = this.normalizeString(paciente.usuario?.documentoIdentidad || '');
      
      // Check if the search term matches either the full name or document
      return nombreCompleto.includes(term) || documento.includes(term);
    }).sort((a, b) => {
      const nameA = this.normalizeString(`${a.usuario?.nombre || ''} ${a.usuario?.apellido || ''}`);
      const nameB = this.normalizeString(`${b.usuario?.nombre || ''} ${b.usuario?.apellido || ''}`);
      return nameA.localeCompare(nameB);
    });
  }

  onSearchInput(value: string) {
    this.pacienteSearchTerm = value;
    this.filterPacientes();
  }

  onPacienteSelected(paciente: Paciente) {
    this.registroForm.patchValue({
      idPaciente: paciente.idPaciente
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const now = new Date();
      const offset = now.getTimezoneOffset();
      const localDate = new Date(now.getTime() - (offset * 60 * 1000));
      
      // Get the form value and ensure idPaciente is included
      const formValue = this.registroForm.getRawValue();
      const signosVitales: SignosVitales = {
        ...formValue,
        fechaRegistro: localDate.toISOString().slice(0, -1)
      };

      if (this.data.signosVitales) {
        // Actualizar
        this.signosVitalesService.actualizar(this.data.signosVitales.idSignos!, signosVitales).subscribe({
          next: () => {
            this.toastService.showSuccess('Registro actualizado correctamente');
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating vital signs:', error);
            const errorMessage = error.error?.error || 'Error al actualizar el registro';
            this.toastService.showError(errorMessage);
          }
        });
      } else {
        // Crear
        this.signosVitalesService.crear(signosVitales).subscribe({
          next: () => {
            this.toastService.showSuccess('Registro creado correctamente');
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating vital signs:', error);
            const errorMessage = error.error?.error || 'Error al crear el registro';
            this.toastService.showError(errorMessage);
          }
        });
      }
    }
  }

  get pacienteNombre(): string {
    const paciente = this.filteredPacientes[0];
    return paciente?.usuario ? `${paciente.usuario.nombre} ${paciente.usuario.apellido}` : '';
  }
} 