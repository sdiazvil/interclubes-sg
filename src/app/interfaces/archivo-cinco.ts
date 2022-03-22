export class ArchivoCinco {
    id?: string;
    file?: File;
    name?: string;
    url?: string;
    path?: string;
    refId?: string;
    creado?: any;
    constructor(file: File) {
        this.file = file;
    }
}