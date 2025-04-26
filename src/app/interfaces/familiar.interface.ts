import { Usuario } from './usuario.interface';
import { Paciente } from './paciente.interface';

export interface Familiar {
    idFamiliar?: number;
    idUsuario: number;
    idPaciente: number;
    parentesco: string;
    autorizadoRegistroSignos: boolean;
    usuario?: Usuario;
    paciente?: Paciente;
} 