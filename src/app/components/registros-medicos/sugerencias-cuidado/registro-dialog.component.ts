import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { SugerenciasCuidadoService } from '../../../services/sugerencias-cuidado.service';
import { SugerenciaCuidado } from '../../../interfaces/registros-medicos.interface';
import { ToastService } from '../../../services/toast.service';
import { AuthContextService } from '../../../auth/auth-context.service';
import { PacienteService } from '../../../services/paciente.service';
import { Paciente } from '../../../interfaces/paciente.interface';
import { firstValueFrom } from 'rxjs';

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
    MatIconModule
  ],
  providers: [PacienteService],
  templateUrl: './registro-dialog.component.html',
  styleUrls: ['./registro-dialog.component.css']
})
export class RegistroDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean = false;
  tipoRegistrador: string = '';
  pacientes: Paciente[] = [];
  filteredPacientes: Paciente[] = [];
  searchControl = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sugerencia?: SugerenciaCuidado },
    private sugerenciasService: SugerenciasCuidadoService,
    private toastService: ToastService,
    private authContext: AuthContextService,
    private pacientesService: PacienteService
  ) {
    const currentUser = this.authContext.getCurrentUser();
    this.tipoRegistrador = currentUser?.tipoUsuario?.toLowerCase() || '';
    
    this.form = this.fb.group({
      idPaciente: [{ value: '', disabled: this.tipoRegistrador !== 'medico' }, Validators.required],
      descripcion: ['', Validators.required],
      prioridad: ['', Validators.required],
      duracionTratamiento: ['', [Validators.required, Validators.min(1)]],
      activo: [true]
    });

    this.isEditMode = !!data?.sugerencia;
  }

  ngOnInit() {
    console.log(this.tipoRegistrador);
    if (this.tipoRegistrador === 'medico') {
      this.loadPacientes();
      this.searchControl.valueChanges.subscribe(value => {
        this.filterPacientes();
      });
    } else {
      const patientId = this.authContext.getCurrentUser()?.idPaciente;
      if (patientId) {
        this.pacientesService.getPacientes().subscribe({
          next: (pacientes: Paciente[]) => {
            const paciente = pacientes.find(p => p.idPaciente === patientId);
            if (paciente) {
              this.pacientes = [paciente];
              this.filteredPacientes = [paciente];
              this.form.patchValue({
                idPaciente: patientId
              });
            }
          },
          error: (error: any) => {
            console.error('Error loading patient:', error);
            this.toastService.showError('Error al cargar los datos del paciente');
          }
        });
      }
    }

    if (this.isEditMode && this.data.sugerencia) {
      this.form.patchValue(this.data.sugerencia);
    }
  }

  async loadPacientes() {
    try {
      const pacientes = await firstValueFrom(this.pacientesService.getPacientes()) || [];
      this.pacientes = pacientes;
      this.filteredPacientes = [...pacientes].sort((a, b) => {
        const nameA = this.normalizeString(`${a.usuario?.nombre || ''} ${a.usuario?.apellido || ''}`);
        const nameB = this.normalizeString(`${b.usuario?.nombre || ''} ${b.usuario?.apellido || ''}`);
        return nameA.localeCompare(nameB);
      });
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
    const term = this.normalizeString(this.searchControl.value || '');
    if (!term) {
      this.filteredPacientes = [...this.pacientes].sort((a, b) => {
        const nameA = this.normalizeString(`${a.usuario?.nombre || ''} ${a.usuario?.apellido || ''}`);
        const nameB = this.normalizeString(`${b.usuario?.nombre || ''} ${b.usuario?.apellido || ''}`);
        return nameA.localeCompare(nameB);
      });
      return;
    }

    this.filteredPacientes = this.pacientes.filter(paciente => {
      const nombreCompleto = this.normalizeString(`${paciente.usuario?.nombre || ''} ${paciente.usuario?.apellido || ''}`);
      const documento = this.normalizeString(paciente.usuario?.documentoIdentidad || '');
      return nombreCompleto.includes(term) || documento.includes(term);
    }).sort((a, b) => {
      const nameA = this.normalizeString(`${a.usuario?.nombre || ''} ${a.usuario?.apellido || ''}`);
      const nameB = this.normalizeString(`${b.usuario?.nombre || ''} ${b.usuario?.apellido || ''}`);
      return nameA.localeCompare(nameB);
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const currentUser = this.authContext.getCurrentUser();
      
      const sugerencia: SugerenciaCuidado = {
        ...formValue,
        fechaRegistro: new Date().toISOString(),
        idMedico: currentUser?.idMedico || null
      };

      if (this.isEditMode && this.data.sugerencia?.idSugerencia) {
        this.sugerenciasService.actualizar(this.data.sugerencia.idSugerencia, sugerencia).subscribe({
          next: () => {
            this.toastService.showSuccess('Sugerencia actualizada correctamente');
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating suggestion:', error);
            this.toastService.showError('Error al actualizar la sugerencia');
          }
        });
      } else {
        this.sugerenciasService.crear(sugerencia).subscribe({
          next: () => {
            this.toastService.showSuccess('Sugerencia creada correctamente');
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating suggestion:', error);
            this.toastService.showError('Error al crear la sugerencia');
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onPacienteSelected(paciente: Paciente) {
    this.form.patchValue({
      idPaciente: paciente.idPaciente
    });
  }
} 