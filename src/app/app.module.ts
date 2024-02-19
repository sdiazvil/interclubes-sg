import { AgmCoreModule } from '@agm/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import locale from '@angular/common/locales/es-CL';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'angular2-moment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import 'moment/locale/es';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ROUTES } from './app.routing';
import { InisesComponent } from './autenticacion/inises/inises.component';
import { RecuperarcontComponent } from './autenticacion/recuperarcont/recuperarcont.component';
import { RegistroComponent } from './autenticacion/registro/registro.component';
import { AdminGuard } from './core/admin.guard';
import { ArchivoService } from './core/archivo.service';
import { AuthGuard } from './core/auth.guard';
import { AuthService } from './core/auth.service';
import { CategoriasService } from './core/categorias.service';
import { ComentariosService } from './core/comentarios.service';
import { ContactosService } from './core/contactos.service';
import { DocPipe } from './core/doc.pipe';
import { DropZoneDirective } from './core/drop-zone.directive';
import { EncuestasService } from './core/encuestas.service';
import { EquipoService } from './core/equipo.service';
import { EventosService } from './core/eventos.service';
import { FileSizePipe } from './core/file-size.pipe';
import { FiltroPipe } from './core/filtro.pipe';
import { FotosService } from './core/fotos.service';
import { GruposService } from './core/grupos.service';
import { LoginGuard } from './core/login.guard';
import { NoticiasService } from './core/noticias.service';
import { OrdenarPipe } from './core/ordenar.pipe';
import { PaginationService } from './core/pagination.service';
import { PerfilService } from './core/perfil.service';
import { ProntoGuard } from './core/pronto.guard';
import { PublicacionService } from './core/publicacion.service';
import { RepositorioService } from './core/repositorio.service';
import { ReversePipe } from './core/reverse.pipe';
import { SafePipe } from './core/safe.pipe';
import { ScrollableDirective } from './core/scrollable.directive';
import { SearchFilterPipe } from './core/search-filter.pipe';
import { TrimPipe } from './core/trim.pipe';
import { VecindariosService } from './core/vecindarios.service';
import { MaterialModule } from './material/material.module';
import { AgregarCarpetaComponent } from './modulos/agregar-carpeta/agregar-carpeta.component';
import { AgregarEncuestaComponent } from './modulos/agregar-encuesta/agregar-encuesta.component';
import { AgregarEventoComponent } from './modulos/agregar-evento/agregar-evento.component';
import { AgregarGrupoComponent } from './modulos/agregar-grupo/agregar-grupo.component';
import { AgregarNoticiaComponent } from './modulos/agregar-noticia/agregar-noticia.component';
import { AgregarVecindarioComponent } from './modulos/agregar-vecindario/agregar-vecindario.component';
import { BajadaComponent } from './modulos/bajada/bajada.component';
import { CategoriasComponent } from './modulos/categorias/categorias.component';
import { CatgruposComponent } from './modulos/catgrupos/catgrupos.component';
import { ConfirmarEliminarComponent } from './modulos/confirmar-eliminar/confirmar-eliminar.component';
import { ContactoComponent } from './modulos/contacto/contacto.component';
import { EncuestaComponent } from './modulos/encuesta/encuesta.component';
import { EncuestasComponent } from './modulos/encuestas/encuestas.component';
import { EquipoComponent } from './modulos/equipo/equipo.component';
import { EscribirPlazaComponent } from './modulos/escribir-plaza/escribir-plaza.component';
import { EventoComponent } from './modulos/evento/evento.component';
import { EventosComponent } from './modulos/eventos/eventos.component';
import { GrupoComponent } from './modulos/grupo/grupo.component';
import { GruposComponent } from './modulos/grupos/grupos.component';
import { ListaUsuariosComponent } from './modulos/lista-usuarios/lista-usuarios.component';
import { NoticiasComponent } from './modulos/noticias/noticias.component';
import { PerfilComponent } from './modulos/perfil/perfil.component';
import { PlazaComponent } from './modulos/plaza/plaza.component';
import { PreviewComponent } from './modulos/preview/preview.component';
import { ProntoComponent } from './modulos/pronto/pronto.component';
import { RepositorioComponent } from './modulos/repositorio/repositorio.component';
import { UsuariosComponent } from './modulos/usuarios/usuarios.component';
import { VecindariosComponent } from './modulos/vecindarios/vecindarios.component';
import { FechaComponent } from './ui/fecha/fecha.component';
import { FooterComponent } from './ui/footer/footer.component';
import { HeaderComponent } from './ui/header/header.component';
import { ModoComponent } from './ui/modo/modo.component';
import { MostrarMasComponent } from './ui/mostrar-mas/mostrar-mas.component';
import { SidenavComponent } from './ui/sidenav/sidenav.component';
import { SpinnerComponent } from './ui/spinner/spinner.component';
import { NotificacionesService } from './core/notificaciones.service';
import { ToastrModule } from 'ngx-toastr';
import { LigaComponent } from './modulos-nuevos/liga/liga.component';
import { MatchesComponent } from './modulos-nuevos/matches/matches.component';
import { TablaComponent } from './modulos-nuevos/tabla/tabla.component';
registerLocaleData(locale);
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
    ConfirmarEliminarComponent,
    LigaComponent,
    MatchesComponent,
    TablaComponent   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    AngularFireModule.initializeApp(environment.firebase),
    //AngularFirestoreModule.enablePersistence(),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgbModule.forRoot(),
    MaterialModule,
    MomentModule,
    InfiniteScrollModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBOzieyGzalZ5117bvhqkvFyZkB6Jx7Ppo'
    }),
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
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
    AdminGuard,
    NotificacionesService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ConfirmarEliminarComponent,AgregarGrupoComponent,AgregarNoticiaComponent,ListaUsuariosComponent, AgregarEventoComponent, AgregarEncuestaComponent, AgregarVecindarioComponent]
})
export class AppModule { }
