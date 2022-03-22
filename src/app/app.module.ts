// Core
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routing';
import { HttpClientModule } from '@angular/common/http';

//Idioma

import {LOCALE_ID} from '@angular/core';
import locale from '@angular/common/locales/es-CL';
import { registerLocaleData } from '@angular/common';
registerLocaleData(locale);

// Modulos
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { MaterialModule } from './material/material.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AgmCoreModule } from '@agm/core';

import { MomentModule } from 'angular2-moment';
import 'moment/locale/es';


// Guards
import { AuthGuard } from './core/auth.guard';
import { LoginGuard } from './core/login.guard';

// import { AuthorGuard } from './servicios/author.guard';
// import { AuthGuard } from './servicios/auth.guard';

// Servicios
import { AuthService } from './core/auth.service';
import { PublicacionService } from './core/publicacion.service';
import { FotosService } from './core/fotos.service';
import { ComentariosService } from './core/comentarios.service';
import { ArchivoService } from './core/archivo.service';
import { ContactosService } from './core/contactos.service';
import { EquipoService } from './core/equipo.service';
import { PerfilService } from './core/perfil.service';
import { EventosService } from './core/eventos.service';
import { NoticiasService } from './core/noticias.service';
import { EncuestasService } from './core/encuestas.service';
import { CategoriasService } from './core/categorias.service';
import { RepositorioService } from './core/repositorio.service';
import { PaginationService } from './core/pagination.service';

// Componentes

import { AppComponent } from './app.component';
import { RegistroComponent } from './autenticacion/registro/registro.component';
import { InisesComponent } from './autenticacion/inises/inises.component';
import { RecuperarcontComponent } from './autenticacion/recuperarcont/recuperarcont.component';

import { PerfilComponent } from './modulos/perfil/perfil.component';

import { FechaComponent } from './ui/fecha/fecha.component';
import { SpinnerComponent } from './ui/spinner/spinner.component';
import { HeaderComponent } from './ui/header/header.component';
import { SidenavComponent } from './ui/sidenav/sidenav.component';

import { MostrarMasComponent } from './ui/mostrar-mas/mostrar-mas.component';
import { EncuestasComponent } from './modulos/encuestas/encuestas.component';
import { RepositorioComponent } from './modulos/repositorio/repositorio.component';
import { ContactoComponent } from './modulos/contacto/contacto.component';
import { EquipoComponent } from './modulos/equipo/equipo.component';
import { EventosComponent } from './modulos/eventos/eventos.component';

//Carga de Archivos
import { DropZoneDirective } from './core/drop-zone.directive';
import { FileSizePipe } from './core/file-size.pipe';
import { AgregarEventoComponent } from './modulos/agregar-evento/agregar-evento.component';
import { AgregarEncuestaComponent } from './modulos/agregar-encuesta/agregar-encuesta.component';
import { SafePipe } from './core/safe.pipe';
import { EncuestaComponent } from './modulos/encuesta/encuesta.component';
import { ModoComponent } from './ui/modo/modo.component';
import { NoticiasComponent } from './modulos/noticias/noticias.component';
import { AgregarNoticiaComponent } from './modulos/agregar-noticia/agregar-noticia.component';
import { ReversePipe } from './core/reverse.pipe';
import { TrimPipe } from './core/trim.pipe';

import { CategoriasComponent } from './modulos/categorias/categorias.component';
import { EventoComponent } from './modulos/evento/evento.component';
import { AgregarCarpetaComponent } from './modulos/agregar-carpeta/agregar-carpeta.component';
import { BajadaComponent } from './modulos/bajada/bajada.component';
import { ScrollableDirective } from './core/scrollable.directive';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FooterComponent } from './ui/footer/footer.component';
import { ProntoComponent } from './modulos/pronto/pronto.component';
import { DocPipe } from './core/doc.pipe';
import { GruposComponent } from './modulos/grupos/grupos.component';
import { GruposService } from './core/grupos.service';
import { GrupoComponent } from './modulos/grupo/grupo.component';
import { CatgruposComponent } from './modulos/catgrupos/catgrupos.component';
import { AgregarGrupoComponent } from './modulos/agregar-grupo/agregar-grupo.component';
import { VecindariosComponent } from './modulos/vecindarios/vecindarios.component';
import { AgregarVecindarioComponent } from './modulos/agregar-vecindario/agregar-vecindario.component';
import { VecindariosService } from './core/vecindarios.service';
import { UsuariosComponent } from './modulos/usuarios/usuarios.component';
import { ListaUsuariosComponent } from './modulos/lista-usuarios/lista-usuarios.component';
import { SearchFilterPipe } from './core/search-filter.pipe';
import { FiltroPipe } from './core/filtro.pipe';
import { ProntoGuard } from './core/pronto.guard';
import { AdminGuard } from './core/admin.guard';
import { OrdenarPipe } from './core/ordenar.pipe';
import { PlazaComponent } from './modulos/plaza/plaza.component';
import { EscribirPlazaComponent } from './modulos/escribir-plaza/escribir-plaza.component';
import { PreviewComponent } from './modulos/preview/preview.component';
import { ConfirmarEliminarComponent } from './modulos/confirmar-eliminar/confirmar-eliminar.component';


@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    InisesComponent,
    RecuperarcontComponent,
    PerfilComponent,
    FechaComponent,
    SpinnerComponent,
    HeaderComponent,
    SidenavComponent,
    DropZoneDirective,
    FileSizePipe,
    MostrarMasComponent,
    EncuestasComponent,
    RepositorioComponent,
    ContactoComponent,
    EquipoComponent,
    EventosComponent,
    AgregarEventoComponent,
    AgregarEncuestaComponent,
    SafePipe,
    EncuestaComponent,
    ModoComponent,
    NoticiasComponent,
    AgregarNoticiaComponent,
    ReversePipe,
    TrimPipe,
    CategoriasComponent,
    EventoComponent,
    AgregarCarpetaComponent,
    BajadaComponent,
    ScrollableDirective,
    FooterComponent,
    ProntoComponent,
    DocPipe,
    GruposComponent,
    GrupoComponent,
    CatgruposComponent,
    AgregarGrupoComponent,
    VecindariosComponent,
    AgregarVecindarioComponent,
    UsuariosComponent,
    ListaUsuariosComponent,
    SearchFilterPipe,
    FiltroPipe,
    OrdenarPipe,
    PlazaComponent,
    EscribirPlazaComponent,
    PreviewComponent,
    ConfirmarEliminarComponent   
  
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgbModule.forRoot(),
    MaterialModule,
    MomentModule,
    InfiniteScrollModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBOzieyGzalZ5117bvhqkvFyZkB6Jx7Ppo'
    })
  ],
  providers: [
    AuthService,
    AuthGuard,
    PublicacionService,
    FotosService,
    ComentariosService,
    ArchivoService,
    PerfilService,
    EventosService,
    LoginGuard,
    ContactosService,
    EquipoService,
    EncuestasService,
    NoticiasService,
    CategoriasService,
    RepositorioService,
    PaginationService,
    GruposService,
    { provide: LOCALE_ID, useValue: "es-CL" },
    VecindariosService,
    NoticiasComponent,
    PlazaComponent,
    ProntoGuard,
    AdminGuard

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ConfirmarEliminarComponent,AgregarGrupoComponent,AgregarNoticiaComponent,ListaUsuariosComponent, AgregarEventoComponent, AgregarEncuestaComponent, AgregarVecindarioComponent]
})

export class AppModule { }
 