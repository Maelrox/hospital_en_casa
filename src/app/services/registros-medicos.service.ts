import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HistorialClinico, SignosVitales } from '../interfaces/registros-medicos.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistrosMedicosService {
  private historialesMock: HistorialClinico[] = [
    {
      id_historial: 1,
      id_paciente: 1,
      id_medico: 2,
      fecha_registro: new Date(),
      diagnostico: 'Gripe común',
      observaciones: 'Paciente presenta síntomas leves',
      tratamiento: 'Reposo y medicamentos básicos',
      seguimiento_requerido: true
    }
  ];

  private signosVitalesMock: SignosVitales[] = [
    {
      idSignos: 1,
      idPaciente: 1,
      fechaRegistro: new Date(),
      oximetria: 98,
      frecuenciaRespiratoria: 16,
      frecuenciaCardiaca: 72,
      temperatura: 36.5,
      presionArterialSistolica: 120,
      presionArterialDiastolica: 80,
      glicemia: 90,
      idRegistrador: 2,
      tipoRegistrador: 'medico'
    }
  ];

  obtenerHistorialPaciente(idPaciente: number): Observable<HistorialClinico[]> {
    return of(this.historialesMock.filter(h => h.id_paciente === idPaciente));
  }

  crearHistorial(historial: HistorialClinico): Observable<HistorialClinico> {
    const nuevoHistorial = {
      ...historial,
      id_historial: this.historialesMock.length + 1,
      fecha_registro: new Date()
    };
    this.historialesMock.push(nuevoHistorial);
    return of(nuevoHistorial);
  }

  obtenerSignosVitales(idPaciente: number): Observable<SignosVitales[]> {
    return of(this.signosVitalesMock.filter(s => s.idPaciente === idPaciente));
  }

  registrarSignosVitales(signos: SignosVitales): Observable<SignosVitales> {
    const nuevosSignos = {
      ...signos,
      id_signos: this.signosVitalesMock.length + 1,
      fecha_registro: new Date()
    };
    this.signosVitalesMock.push(nuevosSignos);
    return of(nuevosSignos);
  }
}
