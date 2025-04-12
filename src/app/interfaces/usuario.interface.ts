export interface Usuario {
    id_usuario?: number;
    tipo_usuario: 'Paciente' | 'Médico' | 'Paciente' | 'Familiar';
    nombre: string;
    apellido: string;
    documento_identidad: string;
    direccion?: string;
    telefono?: string;
    correo_electronico: string;
    nombre_usuario: string;
    contraseña: string;
    estado?: boolean;
    fecha_registro?: Date;
}

export interface Paciente extends Usuario {
    fecha_nacimiento: Date;
    sexo?: 'M' | 'F';
    tipo_sangre?: string;
    alergias?: string;
    antecedentes?: string;
    direccion_residencia?: string;
    contacto_emergencia?: string;
    parentesco_contacto?: string;
    telefono_emergencia?: string;
}

export interface Medico extends Usuario {
    especialidad: string;
    numero_licencia: string;
    registro_profesional: string;
    años_experiencia?: number;
}

export interface Familiar extends Usuario {
    parentesco: string;
    autorizado_registro_signos?: boolean;
    id_paciente: number;
} 