import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { AuthContextService } from '../../../auth/auth-context.service';
import { HistorialClinicoService } from '../../../services/historial-clinico.service';
import { HistorialClinico } from '../../../interfaces/registros-medicos.interface';
import { ToastService } from '../../../services/toast.service';
import { PatientSelectorComponent } from '../../common/paciente-selector/paciente-selector.component';

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
    MatCheckboxModule,
    MatIconModule,
    PatientSelectorComponent
  ],
  templateUrl: './registro-dialog.component.html',
  styleUrls: ['./registro-dialog.component.css']
})
export class RegistroDialogComponent implements OnInit {
  registroForm: FormGroup;
  selectedPaciente: any = null;
  errorMessage: string = '';
  tipoRegistrador: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RegistroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authContext: AuthContextService,
    private historialClinicoService: HistorialClinicoService,
    private toastService: ToastService
  ) {
    const currentUser = this.authContext.getCurrentUser();
    this.tipoRegistrador = currentUser?.tipoUsuario?.toLowerCase() || '';
    
    this.registroForm = this.fb.group({
      idPaciente: ['', this.tipoRegistrador === 'medico' ? Validators.required : []],
      diagnostico: ['', Validators.required],
      tratamiento: ['', Validators.required],
      observaciones: [''],
      seguimientoRequerido: [false],
      tipoRegistrador: [this.tipoRegistrador, Validators.required],
      idRegistrador: [currentUser?.idMedico || currentUser?.idPaciente || currentUser?.idFamiliar || '', Validators.required]
    });

    if (this.data.historial) {
      this.registroForm.patchValue({
        diagnostico: this.data.historial.diagnostico,
        tratamiento: this.data.historial.tratamiento,
        observaciones: this.data.historial.observaciones,
        seguimientoRequerido: this.data.historial.seguimientoRequerido,
        tipoRegistrador: this.data.historial.tipoRegistrador || this.tipoRegistrador,
        idRegistrador: this.data.historial.idRegistrador || currentUser?.idMedico || currentUser?.idPaciente || currentUser?.idFamiliar
      });
    }
  }

  ngOnInit() {
    // No need to load patients here anymore, the patient selector component handles it
  }

  onPacienteSelected(paciente: any) {
    this.selectedPaciente = paciente;
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const now = new Date();
      const offset = now.getTimezoneOffset();
      const localDate = new Date(now.getTime() - (offset * 60 * 1000));
      
      const formValue = this.registroForm.getRawValue();
      const historial: HistorialClinico = {
        ...formValue,
        fechaRegistro: localDate.toISOString().slice(0, -1)
      };

      if (this.data.historial) {
        this.historialClinicoService.actualizar(this.data.historial.idHistorial!, historial).subscribe({
          next: () => {
            this.toastService.showSuccess('Registro actualizado correctamente');
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating clinical history:', error);
            const errorMessage = error.error?.error || 'Error al actualizar el registro';
            this.toastService.showError(errorMessage);
          }
        });
      } else {
        this.historialClinicoService.crear(historial).subscribe({
          next: () => {
            this.toastService.showSuccess('Registro creado correctamente');
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating clinical history:', error);
            const errorMessage = error.error?.error || 'Error al crear el registro';
            this.toastService.showError(errorMessage);
          }
        });
      }
    }
  }
} 