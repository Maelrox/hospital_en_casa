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
    tipoRegistrador: 'medico' | 'familiar' | 'paciente';
    nombrePaciente?: string;
    apellidoPaciente?: string;
    documento?: string;
} 

export interface SugerenciaCuidado {
    idSugerencia?: number;
    idPaciente: number;
    idMedico: number;
    fechaRegistro: string;
    prioridad: string;
    descripcion: string;
    duracionTratamiento: number;
    activo: boolean;
    nombrePaciente?: string;
    paciente?: {
        usuario: {
            nombre: string;
            apellido: string;
            documentoIdentidad: string;
        }
    };
} 