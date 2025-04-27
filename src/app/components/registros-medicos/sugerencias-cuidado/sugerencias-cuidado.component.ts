import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { RegistroDialogComponent } from './registro-dialog.component';
import { SugerenciasCuidadoService } from '../../../services/sugerencias-cuidado.service';
import { SugerenciaCuidado } from '../../../interfaces/registros-medicos.interface';
import { ToastService } from '../../../services/toast.service';
import { AuthContextService } from '../../../auth/auth-context.service';

@Component({
  selector: 'app-sugerencias-cuidado',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './sugerencias-cuidado.component.html',
  styleUrls: ['./sugerencias-cuidado.component.css']
})
export class SugerenciasCuidadoComponent implements OnInit {
  displayedColumns: string[] = [
    'fechaRegistro',
    'nombrePaciente',
    'documento',
    'descripcion',
    'prioridad',
    'duracionTratamiento',
    'acciones'
  ];
  dataSource: MatTableDataSource<SugerenciaCuidado>;
  isMedico: boolean = false;
  isPaciente: boolean = false;
  isFamiliar: boolean = false;
  currentPatientId: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private sugerenciasService: SugerenciasCuidadoService,
    private toastService: ToastService,
    private authContext: AuthContextService
  ) {
    this.dataSource = new MatTableDataSource<SugerenciaCuidado>([]);
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit() {
    const currentUser = this.authContext.getCurrentUser();
    if (currentUser) {
      this.isMedico = currentUser.tipoUsuario === 'Medico';
      this.isPaciente = currentUser.tipoUsuario === 'Paciente';
      this.isFamiliar = currentUser.tipoUsuario === 'Familiar';
      this.currentPatientId = currentUser.idPaciente || null;
      this.loadSugerencias();
    } else {
      this.toastService.showError('Debe iniciar sesión para ver las sugerencias de cuidado');
    }
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

  private createFilter(): (data: SugerenciaCuidado, filter: string) => boolean {
    return (data: SugerenciaCuidado, filter: string): boolean => {
      const searchStr = filter.toLowerCase();
      const paciente = data.paciente;
      return (
        (paciente?.usuario?.nombre || '').toLowerCase().includes(searchStr) ||
        (paciente?.usuario?.apellido || '').toLowerCase().includes(searchStr) ||
        (paciente?.usuario?.documentoIdentidad || '').toLowerCase().includes(searchStr) ||
        (data.descripcion || '').toLowerCase().includes(searchStr) ||
        (data.prioridad || '').toLowerCase().includes(searchStr)
      );
    };
  }

  nuevoRegistro() {
    const dialogRef = this.dialog.open(RegistroDialogComponent, {
      width: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSugerencias();
      }
    });
  }

  editarRegistro(sugerencia: SugerenciaCuidado) {
    const dialogRef = this.dialog.open(RegistroDialogComponent, {
      width: '800px',
      data: { sugerencia }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSugerencias();
      }
    });
  }

  loadSugerencias() {
    this.sugerenciasService.obtenerTodos().subscribe({
      next: (data) => {
        // Filter data based on user type
        let filteredData = data;
        if ((this.isPaciente || this.isFamiliar) && this.currentPatientId) {
          filteredData = data.filter(record => record.idPaciente === this.currentPatientId);
        }

        // Sort by fechaRegistro in descending order
        const sortedData = [...filteredData].sort((a, b) => {
          const dateA = a.fechaRegistro ? new Date(a.fechaRegistro).getTime() : 0;
          const dateB = b.fechaRegistro ? new Date(b.fechaRegistro).getTime() : 0;
          return dateB - dateA;
        });
        this.dataSource.data = sortedData;
      },
      error: (error) => {
        console.error('Error loading suggestions:', error);
        this.toastService.showError('Error al cargar las sugerencias de cuidado');
      }
    });
  }
} 