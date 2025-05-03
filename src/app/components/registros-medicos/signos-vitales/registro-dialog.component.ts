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
import { AuthContextService } from '../../../auth/auth-context.service';
import { SignosVitalesService } from '../../../services/signos-vitales.service';
import { SignosVitales } from '../../../interfaces/registros-medicos.interface';
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
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    PatientSelectorComponent
  ],
  templateUrl: './registro-dialog.component.html',
  styleUrls: ['./registro-dialog.component.css']
})
export class RegistroDialogComponent {
  registroForm: FormGroup;
  selectedPaciente: any = null;
  errorMessage: string = '';
  tipoRegistrador: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RegistroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authContext: AuthContextService,
    private signosVitalesService: SignosVitalesService,
    private toastService: ToastService
  ) {
    const currentUser = this.authContext.getCurrentUser();
    this.tipoRegistrador = currentUser?.tipoUsuario?.toLowerCase() || '';
    
    this.registroForm = this.fb.group({
      idPaciente: ['', this.tipoRegistrador === 'medico' ? Validators.required : []],
      oximetria: ['', [Validators.required, Validators.min(70), Validators.max(100)]],
      frecuenciaRespiratoria: ['', [Validators.required, Validators.min(8), Validators.max(60)]],
      frecuenciaCardiaca: ['', [Validators.required, Validators.min(40), Validators.max(200)]],
      temperatura: ['', [Validators.required, Validators.min(35), Validators.max(42)]],
      presionArterialSistolica: ['', [Validators.required, Validators.min(70), Validators.max(250)]],
      presionArterialDiastolica: ['', [Validators.required, Validators.min(40), Validators.max(150)]],
      glicemia: ['', [Validators.required, Validators.min(50), Validators.max(500)]],
      tipoRegistrador: [this.tipoRegistrador, Validators.required],
      idRegistrador: [currentUser?.idUsuario || '', Validators.required]
    });

    if (this.data.signosVitales) {
      this.registroForm.patchValue(this.data.signosVitales);
    }
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
} 