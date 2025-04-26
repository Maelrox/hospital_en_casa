import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Contraseña de Administrador</h2>
    <mat-dialog-content>
      <mat-form-field style="margin-top: 10px;" appearance="outline" class="full-width">
        <mat-label>Contraseña (admin123)</mat-label>
        <input matInput type="password" [(ngModel)]="password" placeholder="Ingrese la contraseña de administrador">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()">Aceptar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    mat-dialog-content {
      padding: 24px;
      min-height: 120px;
    }
    mat-dialog-actions {
      padding: 8px 24px;
    }
  `]
})
export class AdminPasswordDialogComponent {
  password: string = '';

  constructor(
    private dialogRef: MatDialogRef<AdminPasswordDialogComponent>
  ) {}

  onSubmit() {
    this.dialogRef.close(this.password);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
