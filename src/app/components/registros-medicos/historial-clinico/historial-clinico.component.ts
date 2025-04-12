import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HistorialDialogComponent } from './registro-dialog.component';

@Component({
  selector: 'app-historial-clinico',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './historial-clinico.component.html',
  styleUrls: ['./historial-clinico.component.css']
})
export class HistorialClinicoComponent {
  displayedColumns: string[] = [
    'fecha',
    'id_paciente',
    'nombre_paciente',
    'documento',
    'diagnostico',
    'tratamiento',
    'medicamentos',
    'registrador'
  ];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.historialClinico);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openRegistroDialog(): void {
    const dialogRef = this.dialog.open(HistorialDialogComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, result];
      }
    });
  }

  historialClinico = [
    {
      fecha_registro: new Date('2024-03-15T10:30:00'),
      nombre_paciente: 'Juan Pérez',
      documento: '1234567890',
      id_paciente: 1,
      diagnostico: 'Hipertensión arterial',
      tratamiento: 'Control de presión arterial y dieta baja en sodio',
      medicamentos: 'Losartan 50mg 1 vez al día',
      alergias: 'Penicilina',
      antecedentes: 'Diabetes tipo 2',
      observaciones: 'Paciente estable, seguir monitoreando',
      tipo_registrador: 'medico'
    },
    {
      fecha_registro: new Date('2024-03-15T11:45:00'),
      nombre_paciente: 'María García',
      documento: '9876543210',
      id_paciente: 2,
      diagnostico: 'Asma bronquial',
      tratamiento: 'Uso de inhalador y evitar alérgenos',
      medicamentos: 'Salbutamol 2 puff cada 6 horas',
      alergias: 'Polvo, ácaros',
      antecedentes: 'Ninguno',
      observaciones: 'Mejoría en la respiración',
      tipo_registrador: 'enfermero'
    }
  ];
}
