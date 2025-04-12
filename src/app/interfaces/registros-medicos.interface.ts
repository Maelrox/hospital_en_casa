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
    id_signos?: number;
    id_paciente: number;
    fecha_registro?: Date;
    oximetria?: number;
    frecuencia_respiratoria?: number;
    frecuencia_cardiaca?: number;
    temperatura?: number;
    presion_arterial_sistolica?: number;
    presion_arterial_diastolica?: number;
    glicemia?: number;
    id_registrador: number;
    tipo_registrador: 'medico' | 'familiar' | 'paciente';
} 