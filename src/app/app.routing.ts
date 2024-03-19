import { Routes } from '@angular/router';
import { InisesComponent } from './autenticacion/inises/inises.component';
import { RecuperarcontComponent } from './autenticacion/recuperarcont/recuperarcont.component';
import { RegistroComponent } from './autenticacion/registro/registro.component';
import { AuthGuard } from './core/auth.guard';
import { LoginGuard } from './core/login.guard';
import { ProntoGuard } from './core/pronto.guard';
import { ContactoComponent } from './modulos/contacto/contacto.component';
import { EncuestaComponent } from './modulos/encuesta/encuesta.component';
import { EncuestasComponent } from './modulos/encuestas/encuestas.component';
import { EquipoComponent } from './modulos/equipo/equipo.component';
import { EventoComponent } from './modulos/evento/evento.component';
import { EventosComponent } from './modulos/eventos/eventos.component';
import { GrupoComponent } from './modulos/grupo/grupo.component';
import { GruposComponent } from './modulos/grupos/grupos.component';
import { PerfilComponent } from './modulos/perfil/perfil.component';
import { PlazaComponent } from './modulos/plaza/plaza.component';
import { PreviewComponent } from './modulos/preview/preview.component';
import { ProntoComponent } from './modulos/pronto/pronto.component';
import { RepositorioComponent } from './modulos/repositorio/repositorio.component';
import { UsuariosComponent } from './modulos/usuarios/usuarios.component';
import { VecindariosComponent } from './modulos/vecindarios/vecindarios.component';
import { LigaComponent } from './modulos-nuevos/liga/liga.component';
import { MatchesComponent } from './modulos-nuevos/matches/matches.component';
import { TablaComponent } from './modulos-nuevos/tabla/tabla.component';

const ingreso = 'Ingreso';
const secciones = 'Secciones';

export const ROUTES: Routes = [
  { path: '', component: LigaComponent },
  // { path: 'matches', component: MatchesComponent,  canActivate: [AuthGuard] },
  { path: 'tabla', component: TablaComponent },
  // { path: 'links', component: EncuestasComponent,  canActivate: [AuthGuard] },
  // { path: 'link/:id', component: EncuestaComponent,  canActivate: [AuthGuard] },
  // { path: 'documentos', component: RepositorioComponent,  canActivate: [AuthGuard] },
  // { path: 'equipo', component: EquipoComponent,  canActivate: [AuthGuard] },
  // { path: 'agenda', component: EventosComponent,  canActivate: [AuthGuard] },
  // { path: 'contacto', component: ContactoComponent,  canActivate: [AuthGuard]},
  // { path: 'preview', component: PreviewComponent,  canActivate: [AuthGuard, ProntoGuard] },
  // { path: 'agenda/:id', component: EventoComponent,  canActivate: [AuthGuard] },
  // { path: 'pronto', component: ProntoComponent,  canActivate: [AuthGuard] },
  // { path: 'grupos', component: GruposComponent,  canActivate: [AuthGuard] },
  // { path: 'grupo/:id', component: GrupoComponent,  canActivate: [AuthGuard] },
  // { path: 'comunidades', component: VecindariosComponent,  canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent,  canActivate: [AuthGuard] },
  { path: 'registro', component: RegistroComponent, data: {  active: false, icon: 'person_add', text: 'Crear Cuenta', section: ingreso }, canActivate: [LoginGuard] },
  { path: 'iniciosesion', component: InisesComponent, data: {  active: false, icon: 'person', text: 'Iniciar Sesión', section: ingreso }, canActivate: [LoginGuard] },
  { path: 'recuperarcont', component: RecuperarcontComponent, data: {  active: false, icon: 'lock', text: 'Reestablecer Contraseña', section: ingreso }, canActivate: [LoginGuard] },
  { path: 'perfil', component: PerfilComponent, data: {  active: false, icon: 'person', text: 'Perfil', section: secciones },  canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];
