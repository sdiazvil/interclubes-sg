export class ArchivoDos {
    id?: string;
    file?: File;
    name?: string;
    url?: string;
    path?: string;
    userId?: string;
    creado?: any;
    constructor(file: File) {
        this.file = file;
    }
}