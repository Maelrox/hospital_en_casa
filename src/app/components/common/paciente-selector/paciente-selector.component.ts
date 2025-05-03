import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { PacienteService } from '../../../services/paciente.service';
import { Paciente } from '../../../interfaces/paciente.interface';
import { BehaviorSubject } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { AuthContextService } from '../../../auth/auth-context.service';

@Component({
  selector: 'app-patient-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <mat-form-field appearance="outline" class="form-field" *ngIf="tipoRegistrador === 'medico'">
      <mat-label>Paciente</mat-label>
      <mat-select [formControl]="formControl" [panelClass]="'patient-select-panel'" (selectionChange)="onPacienteSelected($event.value)">
        <div class="search-container">
          <mat-icon class="search-icon">search</mat-icon>
          <input
            matInput
            type="text"
            placeholder="Buscar por nombre o documento"
            [ngModel]="pacienteSearchTerm"
            (ngModelChange)="onSearchInput($event)"
            [ngModelOptions]="{standalone: true}"
            (click)="$event.stopPropagation()"
            (keydown.space)="$event.stopPropagation()"
            autocomplete="off"
            class="search-input"
          />
        </div>
        <mat-option
          *ngFor="let paciente of filteredPacientes"
          [value]="paciente.idPaciente"
        >
          {{ paciente.usuario?.nombre }} {{ paciente.usuario?.apellido }} - {{ paciente.usuario?.documentoIdentidad }}
        </mat-option>
        <mat-option *ngIf="filteredPacientes.length === 0" disabled>
          <div class="no-data-message">
            <mat-icon>info</mat-icon>
            <span>Aún no hay pacientes registrados</span>
          </div>
        </mat-option>
      </mat-select>
      <mat-error *ngIf="formControl.hasError('required')">
        La selección del paciente es requerida
      </mat-error>
    </mat-form-field>

    <input type="hidden" [formControl]="formControl" *ngIf="tipoRegistrador !== 'medico'">
  `,
  styles: [`
    .form-field {
      width: 100%;
    }
    .search-container {
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }
    .search-icon {
      margin-right: 8px;
      color: rgba(0, 0, 0, 0.54);
    }
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
    }
    .no-data-message {
      display: flex;
      align-items: center;
      padding: 8px;
      color: rgba(0, 0, 0, 0.54);
    }
    .no-data-message mat-icon {
      margin-right: 8px;
    }
  `]
})
export class PatientSelectorComponent implements OnInit {
  @Input() control!: AbstractControl;
  @Input() initialPatientId?: number;
  @Output() patientSelected = new EventEmitter<Paciente>();

  private pacientesSubject = new BehaviorSubject<Paciente[]>([]);
  filteredPacientes: Paciente[] = [];
  pacienteSearchTerm: string = '';
  tipoRegistrador: string = '';

  constructor(
    private pacienteService: PacienteService,
    private authContext: AuthContextService
  ) {
    const currentUser = this.authContext.getCurrentUser();
    this.tipoRegistrador = currentUser?.tipoUsuario?.toLowerCase() || '';
  }

  ngOnInit() {
    if (this.tipoRegistrador === 'medico') {
      this.loadPacientes().then(() => {
        if (this.initialPatientId) {
          const currentPatient = this.filteredPacientes.find(p => p.idPaciente === this.initialPatientId);
          if (currentPatient) {
            this.control.setValue(currentPatient.idPaciente);
          }
        }
      });
    } else {
      const currentUser = this.authContext.getCurrentUser();
      const patientId = this.tipoRegistrador === 'paciente'
        ? currentUser?.idPaciente
        : currentUser?.idPaciente;

      if (patientId) {
        this.control.setValue(patientId);
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

  onPacienteSelected(idPaciente: number) {
    const paciente = this.filteredPacientes.find(p => p.idPaciente === idPaciente);
    if (paciente) {
      this.patientSelected.emit(paciente);
    }
  }

  get formControl(): FormControl {
    return this.control as FormControl;
  }
} 