import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
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
import { SignosVitalesService } from '../../../services/signos-vitales.service';
import { SignosVitales } from '../../../interfaces/registros-medicos.interface';
import { RegistroDialogComponent } from './registro-dialog.component';
import { ToastService } from '../../../services/toast.service';
import { AuthContextService } from '../../../auth/auth-context.service';
import { Subscription } from 'rxjs';

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
export class SignosVitalesComponent implements OnInit, OnDestroy {
  formulario: FormGroup;
  errorMensaje: string = '';
  signosVitales: SignosVitales[] = [];
  isMedico: boolean = false;
  isPaciente: boolean = false;
  isFamiliar: boolean = false;
  currentPatientId: number | null = null;
  private authSubscription: Subscription | null = null;

  // Configuración de la tabla
  displayedColumns: string[] = [
    'fechaRegistro',
    'idPaciente',
    'nombrePaciente',
    'apellidoPaciente',
    'documento',
    'oximetria',
    'frecuenciaRespiratoria',
    'frecuenciaCardiaca',
    'temperatura',
    'presionArterialSistolica',
    'presionArterialDiastolica',
    'glicemia',
    'tipoRegistrador',
    'acciones'
  ];

  dataSource: MatTableDataSource<SignosVitales>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private signosVitalesService: SignosVitalesService,
    private dialog: MatDialog,
    private toastService: ToastService,
    private authContext: AuthContextService
  ) {
    this.formulario = this.fb.group({
      idPaciente: ['', Validators.required],
      oximetria: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      frecuenciaRespiratoria: ['', Validators.required],
      frecuenciaCardiaca: ['', Validators.required],
      temperatura: ['', Validators.required],
      presionArterialSistolica: ['', Validators.required],
      presionArterialDiastolica: ['', Validators.required],
      glicemia: ['', Validators.required],
      tipoRegistrador: ['', Validators.required],
      idRegistrador: ['', Validators.required]
    });

    this.dataSource = new MatTableDataSource<SignosVitales>([]);
  }

  ngOnInit() {
    this.authSubscription = this.authContext.currentUser$.subscribe(user => {
      if (user) {
        this.isMedico = user.tipoUsuario === 'Medico';
        this.isPaciente = user.tipoUsuario === 'Paciente';
        this.isFamiliar = user.tipoUsuario === 'Familiar';
        this.currentPatientId = user.idPaciente || null;
        this.loadSignosVitales();
      } else {
        this.toastService.showError('Debe iniciar sesión para ver los signos vitales');
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

  loadSignosVitales() {
    this.signosVitalesService.obtenerTodos().subscribe({
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
        console.error('Error loading vital signs:', error);
        this.toastService.showError('Error al cargar los signos vitales');
      }
    });
  }

  openRegistroDialog(signosVitales?: SignosVitales): void {
    if (!this.isMedico && !this.isFamiliar && !this.isPaciente) {
      this.toastService.showError('Función solo disponible para médicos y familiares autorizados');
      return;
    }
    const dialogRef = this.dialog.open(RegistroDialogComponent, {
      width: '600px',
      data: { signosVitales }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSignosVitales();
      }
    });
  }

  editarRegistro(signosVitales: SignosVitales) {
    if (!this.isMedico && !this.isFamiliar) {
      this.toastService.showError('Función solo disponible para médicos y familiares autorizados');
      return;
    }
    this.openRegistroDialog(signosVitales);
  }

  eliminarRegistro(id: number) {
    if (!this.isMedico) {
      this.toastService.showError('Función solo disponible para médicos');
      return;
    }

    this.signosVitalesService.eliminar(id).subscribe({
      next: () => {
        this.toastService.showSuccess('Registro eliminado correctamente');
        this.loadSignosVitales();
      },
      error: (error) => {
        console.error('Error deleting vital signs:', error);
        this.toastService.showError('Error al eliminar el registro');
      }
    });
  }
}
