import { User } from './user';

export interface Comentario {
  id?: any;
  texto?: string;
  creado?: any;
  posteadoPor?: User;
  megusta?: number;
  publicacionId?: any;
}