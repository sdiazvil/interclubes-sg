export class ArchivoSeis {
    id?: string;
    file?: File;
    name?: string;
    url?: string;
    path?: string;
    grupoId?: string;
    creado?: any;
    constructor(file: File) {
        this.file = file;
    }
}