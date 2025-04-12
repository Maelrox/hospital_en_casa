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
  selector: 'app-registro-dialog',
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
export class RegistroDialogComponent {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RegistroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.registroForm = this.fb.group({
      pacienteId: ['', Validators.required],
      oximetria: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      frecuenciaRespiratoria: ['', [Validators.required, Validators.min(0)]],
      frecuenciaCardiaca: ['', [Validators.required, Validators.min(0)]],
      temperatura: ['', [Validators.required, Validators.min(35), Validators.max(42)]],
      presionArterial: ['', [Validators.required, Validators.pattern(/^\d{2,3}\/\d{2,3}$/)]],
      glicemia: ['', [Validators.required, Validators.min(0)]],
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