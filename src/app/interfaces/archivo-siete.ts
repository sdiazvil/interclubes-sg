export class ArchivoSiete {
    id?: string;
    file?: File;
    name?: string;
    url?: string;
    path?: string;
    comentarioId?: string;
    creado?: any;
    constructor(file: File) {
        this.file = file;
    }
}