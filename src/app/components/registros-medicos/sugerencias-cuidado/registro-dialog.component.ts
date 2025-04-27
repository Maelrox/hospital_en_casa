import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sugerencia?: SugerenciaCuidado },
    private sugerenciasService: SugerenciasCuidadoService,
    private toastService: ToastService,
    private authContext: AuthContextService,
    private pacientesService: PacienteService
  ) {
    this.form = this.fb.group({
      idPaciente: ['', Validators.required],
      descripcion: ['', Validators.required],
      prioridad: ['', Validators.required],
      duracionTratamiento: ['', [Validators.required, Validators.min(1)]],
      activo: [true]
    });

    this.isEditMode = !!data?.sugerencia;
  }

  ngOnInit() {
    this.authContext.currentUser$.subscribe(user => {
      if (user) {
        this.tipoRegistrador = user.tipoUsuario;
        
        if (this.tipoRegistrador !== 'Medico') {
          // For non-medicos, set the patient ID and disable the field
          this.form.patchValue({
            idPaciente: user.idPaciente
          });
          this.form.get('idPaciente')?.disable();
        } else {
          // For medicos, load all patients
          this.loadPacientes();
        }
      }
    });

    if (this.isEditMode && this.data.sugerencia) {
      this.form.patchValue(this.data.sugerencia);
    }
  }

  loadPacientes() {
    this.pacientesService.getPacientes().subscribe({
      next: (data: Paciente[]) => {
        this.pacientes = data;
        this.filteredPacientes = [...data];
      },
      error: (error: any) => {
        console.error('Error loading patients:', error);
        this.toastService.showError('Error al cargar los pacientes');
      }
    });
  }

  filterPacientes() {
    if (!this.searchTerm) {
      this.filteredPacientes = [...this.pacientes];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredPacientes = this.pacientes.filter(paciente =>
      paciente.usuario?.nombre?.toLowerCase().includes(searchLower) ||
      paciente.usuario?.documentoIdentidad?.toLowerCase().includes(searchLower)
    );
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
} 