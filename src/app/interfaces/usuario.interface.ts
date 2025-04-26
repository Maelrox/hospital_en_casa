export interface Usuario {
    idUsuario?: number;
    tipoUsuario: 'Paciente' | 'Médico' | 'Paciente' | 'Familiar';
    nombre: string;
    apellido: string;
    documentoIdentidad: string;
    direccion?: string;
    telefono?: string;
    correoElectronico: string;
    nombreUsuario: string;
    contraseña: string;
    estado?: boolean;
    fechaRegistro?: Date;
}

export interface Paciente extends Usuario {
    fecha_nacimiento: Date;
    sexo?: 'M' | 'F';
    tipoSangre?: string;
    alergias?: string;
    antecedentes?: string;
    direccionResidencia?: string;
    contactoEmergencia?: string;
    parentescoContacto?: string;
    telefonoEmergencia?: string;
}

export interface Medico extends Usuario {
    especialidad: string;
    numeroLicencia: string;
    registroProfesional: string;
    añosExperiencia?: number;
}

export interface Familiar extends Usuario {
    parentesco: string;
    autorizadoRegistroSignos?: boolean;
    paciente: Paciente;
} 