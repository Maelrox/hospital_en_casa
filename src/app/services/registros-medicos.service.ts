import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SignosVitales } from '../interfaces/registros-medicos.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistrosMedicosService {
  

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
