import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { RegistrosMedicosService } from '../../../services/registros-medicos.service';
import { SignosVitales } from '../../../interfaces/registros-medicos.interface';
import { RegistroDialogComponent } from './registro-dialog.component';

@Component({
  selector: 'app-signos-vitales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './signos-vitales.component.html',
  styleUrls: ['./signos-vitales.component.css']
})
export class SignosVitalesComponent {
  formulario: FormGroup;
  errorMensaje: string = '';

  // Configuración de la tabla
  displayedColumns: string[] = [
    'fecha',
    'id_paciente',
    'nombre_paciente',
    'documento',
    'oximetria',
    'frecuencia_respiratoria',
    'frecuencia_cardiaca',
    'temperatura',
    'presion_arterial',
    'glicemia',
    'registrador'
  ];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private registrosMedicosService: RegistrosMedicosService,
    private dialog: MatDialog
  ) {
    this.formulario = this.fb.group({
      id_paciente: ['', Validators.required],
      oximetria: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      frecuencia_respiratoria: ['', Validators.required],
      frecuencia_cardiaca: ['', Validators.required],
      temperatura: ['', Validators.required],
      presion_arterial_sistolica: ['', Validators.required],
      presion_arterial_diastolica: ['', Validators.required],
      glicemia: ['', Validators.required],
      tipo_registrador: ['', Validators.required],
      id_registrador: ['', Validators.required]
    });

    // Inicializar la fuente de datos de la tabla
    this.dataSource = new MatTableDataSource(this.signosVitales);
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

  onSubmit() {
    if (this.formulario.valid) {
      // TODO: Implementar la lógica de envío
      const nuevoRegistro = {
        ...this.formulario.value,
        fecha_registro: new Date()
      };

      this.signosVitales.unshift(nuevoRegistro);
      this.dataSource.data = this.signosVitales;
      this.formulario.reset();
    }
  }

  openRegistroDialog(): void {
    const dialogRef = this.dialog.open(RegistroDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, result];
      }
    });
  }

  signosVitales = [
    {
      fecha_registro: new Date('2024-03-15T10:30:00'),
      nombre_paciente: 'Juan Pérez',
      documento: '1234567890',
      id_paciente: 1,
      oximetria: 98,
      frecuencia_respiratoria: 16,
      frecuencia_cardiaca: 72,
      temperatura: 36.5,
      presion_arterial_sistolica: 120,
      presion_arterial_diastolica: 80,
      glicemia: 90,
      tipo_registrador: 'medico'
    },
    {
      fecha_registro: new Date('2024-03-15T11:45:00'),
      nombre_paciente: 'María García',
      documento: '9876543210',
      id_paciente: 2,
      oximetria: 95,
      frecuencia_respiratoria: 18,
      frecuencia_cardiaca: 85,
      temperatura: 37.2,
      presion_arterial_sistolica: 130,
      presion_arterial_diastolica: 85,
      glicemia: 110,
      tipo_registrador: 'enfermero'
    },
    {
      fecha_registro: new Date('2024-03-15T14:20:00'),
      nombre_paciente: 'Carlos López',
      documento: '4567891230',
      id_paciente: 3,
      oximetria: 99,
      frecuencia_respiratoria: 14,
      frecuencia_cardiaca: 68,
      temperatura: 36.8,
      presion_arterial_sistolica: 115,
      presion_arterial_diastolica: 75,
      glicemia: 95,
      tipo_registrador: 'medico'
    },
    {
      fecha_registro: new Date('2024-03-15T16:00:00'),
      nombre_paciente: 'Ana Martínez',
      documento: '7891234560',
      id_paciente: 4,
      oximetria: 97,
      frecuencia_respiratoria: 20,
      frecuencia_cardiaca: 92,
      temperatura: 37.5,
      presion_arterial_sistolica: 140,
      presion_arterial_diastolica: 90,
      glicemia: 120,
      tipo_registrador: 'familiar'
    }
  ];
}
