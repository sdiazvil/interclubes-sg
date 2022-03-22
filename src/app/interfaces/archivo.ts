export class Archivo {
    id?: string;
    file?: File;
    name?: string;
    url?: string;
    path?: string;
    publicacionId?: string;
    creado?: any;
    constructor(file: File) {
        this.file = file;
    }
}