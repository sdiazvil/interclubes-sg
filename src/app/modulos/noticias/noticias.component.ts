import { Component, OnInit, ViewChild, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AgregarNoticiaComponent } from '../agregar-noticia/agregar-noticia.component';
import { NoticiasService } from '../../core/noticias.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { MatSidenav } from '@angular/material';
import { EventosService } from '../../core/eventos.service';
import { VecindariosService } from '../../core/vecindarios.service';
import { AppComponent } from '../../app.component';

const SMALL_WIDTH_BREAKPOINT = 1100;

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css'],
})
export class NoticiasComponent implements OnInit {

  eventos: any;

  modalOption: NgbModalOptions = {}; // not null!
  noticias: any;
  noticias$: any;
  formulario: FormGroup;
  maxCom = -3;
  revMax = 3;

  private twitter: any;


  maxNoticias = 10;
  mensajeMax: string;

  cargando = true;

  vecindario: any;
  veci: any;
  user: any;

  constructor(public vs: VecindariosService , private es: EventosService, private storage: AngularFireStorage, public fb: FormBuilder, public snackBar: MatSnackBar, public authService: AuthService, private ns: NoticiasService, private modalService: NgbModal, ) {

  }

  ngOnInit() {

    // setTimeout(() => {
    // }, 1000);

    this.vecindario = this.vs.getVecindario(this.authService.vecindarioId);


    // this.noticias = this.ns.getNoticiasFecha();
    // this.noticias$ = this.ns.getNoticiasFecha();
    this.noticias$ = this.ns.getNoticiasFiltrable();
    this.ns.filtroVecindario$.next(this.authService.vecindarioId);
    // this.ns.limit$.next(this.maxNoticias);
    this.formulario = this.fb.group({
      'texto': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
    });

    setTimeout(() => {
      this.cargando = false;
    }, 1000);

    this.vs.getVecindario(this.authService.vecindarioId).subscribe(vecindario =>
      this.veci = vecindario);

      this.authService.user.subscribe(user => this.user = user);

  }


  get texto() { return this.formulario.get('texto') }


  ngOnDestroy() {
  }

  open() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(AgregarNoticiaComponent, this.modalOption);
    // modalRef.componentInstance.id = this.id;
  }

  toggleOculto(variable: boolean) {
    if (variable) {
      this.vs.actualizarVecindario(this.authService.vecindarioId,
        {
          comentarios_plaza: false,
        }
      );
    } else {
      this.vs.actualizarVecindario(this.authService.vecindarioId,
        {
          comentarios_plaza: true,
        }
      );
    }
  }

  eliminar(noticia: any) {

    noticia.fotos.forEach(foto => {
      this.storage.ref(foto.path).delete();
    });

    this.ns.eliminar(noticia.id);

    this.snackBar.open('La publicación ha sido eliminada correctamente.', 'CERRAR', {
      duration: 4000
    });
  }

  meGusta(id: string, arreglo: Array<any>, userId: string) {
    //console.log(arreglo)
    arreglo.push({
      userId: userId,
      // numero: 3
    });

    this.ns.actualizar(id,
      { megusta: arreglo }
    );
  }

  eliminarMeGusta(id: string, arreglo: Array<any>, userId: string) {
    //console.log(arreglo)
    arreglo = arreglo.filter(item => item.userId !== userId)

    this.ns.actualizar(id,
      { megusta: arreglo }
    );
  }

  checkMeGusta(arreglo: Array<any>, userId: string): boolean {
    return arreglo = arreglo.find(item =>
      item.userId == userId
    )
  }


  comentar(id: string, user: any, arreglo: Array<any>, ) {

    var texto_con_espacio = this.texto.value.replace(new RegExp('\n', 'g'), "<br>");

    arreglo.push({
      userId: user.uid,
      // photoURL: user.photoURL,
      // displayName: user.displayName,
      comentario: texto_con_espacio,
      fecha: new Date().getTime(),
      id: this.ns.crearId(),
      userRef: this.authService.getUserPub(user.uid).ref,
      // numero: 3
    });

    this.ns.actualizar(id,
      { comentarios: arreglo }
    );

    this.formulario.reset();

    setTimeout(() => {
      this.ngOnInit();
    }, 1000);

  }

  eliminarComentario(id: string, arreglo: Array<any>, idNoticia: string) {
    // console.log(arreglo)
    arreglo = arreglo.filter(item => item.id !== id)

    this.ns.actualizar(idNoticia,
      { comentarios: arreglo }
    );
  }

  cargarMasNoticias() {
    this.maxNoticias = this.maxNoticias + 10;
  }

  cargarComentarios() {
    this.maxCom = this.maxCom - 5;
    this.revMax = this.revMax + 5;
  }

  itemTrackBy(index: number, item) {
    return item.id;
  }

  comentariosActivos(){
    if(this.veci.comentarios_plaza){
      return true;
    }else{
      return false;
    }
  }

  checkAdminBarrio(admins: Array<any>): boolean {

    if (this.user) {
      return admins = admins.find(item =>
        item.userId == this.user.uid
      )
    }

  }
  

  // loadMoreArticles() {
  //   this.maxNoticias = this.maxNoticias + 3;
  // }

  // checkMas(largo: number){
  //   if(largo > this.maxNoticias){
  //     this.maxNoticias +=3;
  //     return true;

  //   } else{
  //     return false;
  //   }
  // }

  // scrollHandler(e) {
  //   if (e === 'bottom') {
  //     console.log('Final de la Página');
  //   }
  // }

  // onScrollDown() {
  //   console.log('scrolled!!')
  //   // this.getMovies()
  // }

  // onScroll(event: any) {

  //   if (((window.innerHeight + window.scrollY + 1) >= document.body.offsetHeight) || ((window.innerHeight + document.documentElement.scrollTop) >= document.body.offsetHeight)) {
  //     console.log('Scolleando!!');
  //   }
  // }
 

}
