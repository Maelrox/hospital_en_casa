import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PacienteService } from '../../../services/paciente.service';
import { Paciente } from '../../../interfaces/paciente.interface';
import { BehaviorSubject } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { AuthContextService } from '../../../auth/auth-context.service';
import { HistorialClinicoService } from '../../../services/historial-clinico.service';
import { HistorialClinico } from '../../../interfaces/registros-medicos.interface';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-historial-dialog',
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
    MatCheckboxModule
  ],
  providers: [DatePipe],
  templateUrl: './registro-dialog.component.html',
  styleUrls: ['./registro-dialog.component.css']
})
export class HistorialDialogComponent implements OnInit {
  registroForm: FormGroup;
  private pacientesSubject = new BehaviorSubject<Paciente[]>([]);
  filteredPacientes: Paciente[] = [];
  pacienteSearchTerm: string = '';
  selectedPaciente: Paciente | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<HistorialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pacienteService: PacienteService,
    private authContext: AuthContextService,
    private historialService: HistorialClinicoService,
    private toastService: ToastService,
    private datePipe: DatePipe
  ) {
    const currentUser = this.authContext.getCurrentUser();
    this.registroForm = this.fb.group({
      idPaciente: ['', Validators.required],
      idMedico: [currentUser?.idMedico || '', Validators.required],
      diagnostico: ['', Validators.required],
      observaciones: [''],
      tratamiento: ['', Validators.required],
      seguimientoRequerido: [false]
    });
  }

  ngOnInit() {
    this.loadPacientes();
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
    this.registroForm.patchValue({
      idPaciente: paciente.idPaciente
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const now = new Date();
      const offset = now.getTimezoneOffset();
      const localDate = new Date(now.getTime() - (offset * 60 * 1000));
      
      const historial: HistorialClinico = {
        ...this.registroForm.value,
        fechaRegistro: localDate.toISOString().slice(0, -1) // Remove the 'Z' suffix
      };

      this.historialService.crear(historial).subscribe({
        next: (response) => {
          this.toastService.showSuccess('Historial clínico creado exitosamente');
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error creating medical history:', error);
          this.errorMessage = 'Error al crear el historial clínico';
          this.toastService.showError('Error al crear el historial clínico');
        }
      });
    }
  }
} 