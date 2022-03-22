export class ArchivoTres {
    id?: string;
    file?: File;
    name?: string;
    url?: string;
    path?: string;
    eventoId?: string;
    creado?: any;
    constructor(file: File) {
        this.file = file;
    }
}