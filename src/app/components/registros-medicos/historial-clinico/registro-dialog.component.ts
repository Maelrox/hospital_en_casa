import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-historial-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './registro-dialog.component.html',
  styleUrls: ['./registro-dialog.component.css']
})
export class HistorialDialogComponent {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<HistorialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.registroForm = this.fb.group({
      pacienteId: ['', Validators.required],
      diagnostico: ['', Validators.required],
      tratamiento: ['', Validators.required],
      medicamentos: ['', Validators.required],
      alergias: [''],
      antecedentes: [''],
      observaciones: [''],
      tipoRegistrante: ['', Validators.required],
      registranteId: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const nuevoRegistro = {
        ...this.registroForm.value,
        fecha_registro: new Date()
      };
      this.dialogRef.close(nuevoRegistro);
    }
  }
} 