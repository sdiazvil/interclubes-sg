// export interface Roles {
//     reader: boolean;
//     author?: boolean;
//     admin?: boolean;
// }
// export class User {
//     email: string;
//     photoURL: string;
//     roles: Roles;
//     uid: string;
//     username: string = "";
//     constructor(authData) {
//         this.uid = authData.uid;
//         this.username = authData.username;
//         this.email = authData.email
//         this.photoURL = authData.photoURL
//         this.roles = { reader: true }
//     }
// }

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