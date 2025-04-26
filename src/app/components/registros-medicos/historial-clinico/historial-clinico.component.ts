import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
import { HistorialDialogComponent } from './registro-dialog.component';
import { HistorialClinicoService } from '../../../services/historial-clinico.service';
import { HistorialClinico } from '../../../interfaces/registros-medicos.interface';
import { ToastService } from '../../../services/toast.service';
import { AuthContextService } from '../../../auth/auth-context.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-historial-clinico',
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
  templateUrl: './historial-clinico.component.html',
  styleUrls: ['./historial-clinico.component.css']
})
export class HistorialClinicoComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'fechaRegistro',
    'nombrePaciente',
    'documento',
    'diagnostico',
    'tratamiento',
    'observaciones',
    'seguimientoRequerido',
    'acciones'
  ];
  dataSource: MatTableDataSource<HistorialClinico>;
  isMedico: boolean = false;
  isPaciente: boolean = false;
  currentPatientId: number | null = null;
  private authSubscription: Subscription | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private historialService: HistorialClinicoService,
    private toastService: ToastService,
    private authContext: AuthContextService
  ) {
    this.dataSource = new MatTableDataSource<HistorialClinico>([]);
  }

  ngOnInit() {
    this.authSubscription = this.authContext.currentUser$.subscribe(user => {
      if (user) {
        this.isMedico = user.tipoUsuario === 'Médico';
        this.isPaciente = user.tipoUsuario === 'Paciente';
        this.currentPatientId = user.idPaciente || null;
        this.loadHistorialClinico();
      } else {
        this.toastService.showError('Debe iniciar sesión para ver el historial clínico');
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
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

  nuevoRegistro() {
    if (!this.isMedico) {
      this.toastService.showError('Función solo disponible para médicos');
      return;
    }
    this.openRegistroDialog();
  }

  editarRegistro(historial: HistorialClinico) {
    if (!this.isMedico) {
      this.toastService.showError('Función solo disponible para médicos');
      return;
    }
    const dialogRef = this.dialog.open(HistorialDialogComponent, {
      width: '800px',
      data: { historial }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadHistorialClinico();
      }
    });
  }

  loadHistorialClinico() {
    this.historialService.obtenerTodos().subscribe({
      next: (data) => {
        // Filter data based on user type
        let filteredData = data;
        console.log(this.currentPatientId);
        if (this.isPaciente && this.currentPatientId) {
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
        console.error('Error loading medical history:', error);
        this.toastService.showError('Error al cargar el historial clínico');
      }
    });
  }

  openRegistroDialog() {
    const dialogRef = this.dialog.open(HistorialDialogComponent, {
      width: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadHistorialClinico();
      }
    });
  }
}
