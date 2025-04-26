export interface HistorialClinico {
    id_historial?: number;
    id_paciente: number;
    id_medico: number;
    fecha_registro?: Date;
    diagnostico: string;
    observaciones?: string;
    tratamiento?: string;
    seguimiento_requerido?: boolean;
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
} 