export class ArchivoOcho {
    id?: string;
    file?: File;
    name?: string;
    url?: string;
    path?: string;
    vecindarioId?: string;
    creado?: any;
    tipo?: any;
    constructor(file: File) {
        this.file = file;
    }
}