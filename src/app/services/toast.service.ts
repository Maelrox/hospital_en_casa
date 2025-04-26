import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration: number = 4500): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string, duration: number = 9000): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
} 