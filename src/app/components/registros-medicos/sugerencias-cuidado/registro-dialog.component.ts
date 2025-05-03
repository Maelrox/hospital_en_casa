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
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    PatientSelectorComponent
  ],
  templateUrl: './registro-dialog.component.html',
  styleUrls: ['./registro-dialog.component.css']
})
export class RegistroDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean = false;
  tipoRegistrador: string = '';
  selectedPaciente: any = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sugerencia?: SugerenciaCuidado },
    private sugerenciasService: SugerenciasCuidadoService,
    private toastService: ToastService,
    private authContext: AuthContextService
  ) {
    const currentUser = this.authContext.getCurrentUser();
    this.tipoRegistrador = currentUser?.tipoUsuario?.toLowerCase() || '';
    
    this.form = this.fb.group({
      idPaciente: ['', this.tipoRegistrador === 'medico' ? Validators.required : []],
      descripcion: ['', Validators.required],
      prioridad: ['', Validators.required],
      duracionTratamiento: ['', [Validators.required, Validators.min(1)]],
      activo: [true]
    });

    this.isEditMode = !!data?.sugerencia;
  }

  ngOnInit() {
    if (this.isEditMode && this.data.sugerencia) {
      this.form.patchValue(this.data.sugerencia);
    }
  }

  onPacienteSelected(paciente: any) {
    this.selectedPaciente = paciente;
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