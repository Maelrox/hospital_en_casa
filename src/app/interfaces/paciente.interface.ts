import { SignosVitales } from "./registros-medicos.interface";
import { Familiar, Usuario } from "./usuario.interface";

export interface Paciente {
    idPaciente: number;
    idUsuario: number;
    fechaNacimiento: Date;
    sexo: string;
    tipoSangre: string;
    alergias: string;
    antecedentes: string;
    direccionResidencia: string;
    contactoEmergencia: string;
    parentescoContacto: string;
    telefonoEmergencia: string;
    familiares: Familiar[];
    signosVitales: SignosVitales[];
} 