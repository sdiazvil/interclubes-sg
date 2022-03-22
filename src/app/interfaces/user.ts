
export interface User {
    uid: string;
    email?: string;
    photoURL?: string;
    displayName?: string;
    fecha_registro: any;
    region?: string;  
    ciudad?: string;  
    fecha_nac?: Date;  
    genero?: string;  
    ocupacion?: string;  
    ocupacion_otro?: string;  
    admin?: boolean;  
    path?: any; 
    actual?: any; 
    vecindarios?: Array<any>; 
  }