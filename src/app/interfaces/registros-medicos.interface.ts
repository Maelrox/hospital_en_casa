import { Medico, Paciente } from "./usuario.interface";

export interface HistorialClinico {
    idHistorial?: number;
    idPaciente: number;
    idMedico: number;
    fechaRegistro?: Date;
    diagnostico: string;
    observaciones?: string;
    tratamiento?: string;
    seguimientoRequerido?: boolean;
}

export interface SignosVitales {
    idSignos?: number;
    idPaciente: number;
    fechaRegistro?: Date;
    oximetria?: number;
    frecuenciaRespiratoria?: number;
    frecuenciaCardiaca?: number;
    temperatura?: number;
    presionArterialSistolica?: number;
    presionArterialDiastolica?: number;
    glicemia?: number;
    idRegistrador: number;
    tipoRegistrador: 'médico' | 'familiar' | 'paciente';
    nombrePaciente?: string;
    apellidoPaciente?: string;
    documento?: string;
} 

export interface SugerenciaCuidado {
    idSugerencia: number;
    idPaciente: number;
    idMedico: number;
    fechaRegistro: Date;
    prioridad: string;
    descripcion: string;
    duracionTratamiento: number;
    activo: boolean;
    paciente: Paciente;
    medico: Medico;
} 