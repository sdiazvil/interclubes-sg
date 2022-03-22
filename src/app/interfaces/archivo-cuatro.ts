export class ArchivoCuatro {
    id?: string;
    file?: File;
    name?: string;
    url?: string;
    path?: string;
    noticiaId?: string;
    creado?: any;
    constructor(file: File) {
        this.file = file;
    }
}