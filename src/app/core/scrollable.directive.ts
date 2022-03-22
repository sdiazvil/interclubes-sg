import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
export interface Viewport {
  h: number;
  w: number;
}
export type InfiniteScrollContext = 'self' | 'document';
@Directive({
  selector: '[appScrollable]'
})
export class ScrollableDirective implements OnInit {
  el: any;
  viewport: Viewport;
  canTriggerAction: boolean = true;
  @Input() infiniteScrollContext: InfiniteScrollContext = 'document';
  @Output() infiniteScrollAction: EventEmitter<any> = new EventEmitter();
  @HostListener('scroll', ['$event']) onElementScroll() {
    if (this.infiniteScrollContext === 'self') {
      if (this.elementEndReachedInSelfScrollbarContext() && this.canTriggerAction) {
        this.triggerAction();
      }
    }
  }
  constructor(private element: ElementRef) {
    this.el = element.nativeElement;
    this.viewport = this.getViewport(window);
  }
  ngOnInit() {
    if (this.infiniteScrollContext === 'document') {
      document.addEventListener('scroll', () => {
        if (this.elementEndReachedInDocumentScrollbarContext(window, this.el) && this.canTriggerAction) {
          this.triggerAction();
        }
      });
    }
  }
  triggerAction() {
    this.canTriggerAction = false;
    this.infiniteScrollAction.emit(null);
  }
  elementEndReachedInSelfScrollbarContext(): boolean {
    if (this.el.scrollTop + this.el.offsetHeight >= this.el.scrollHeight) {
      this.canTriggerAction = true;
      return true;
    }
    return false;
  }
  elementEndReachedInDocumentScrollbarContext(win: Window, el: any): boolean {
    const rect = el.getBoundingClientRect();
    const elementTopRelativeToViewport = rect.top;
    const elementTopRelativeToDocument = elementTopRelativeToViewport + win.pageYOffset;
    const scrollableDistance = el.offsetHeight + elementTopRelativeToDocument;
    const currentPos = win.pageYOffset + this.viewport.h;
    if (currentPos > scrollableDistance) {
      this.canTriggerAction = true;
      return true;
    }
    return false;
  }
  private getViewport(win: Window): Viewport {
    if (win.innerWidth != null) {
      return {
        w: win.innerWidth,
        h: win.innerHeight
      };
    }
    let d = win.document;
    if (document.compatMode == 'CSS1Compat') {
      return {
        w: d.documentElement.clientWidth,
        h: d.documentElement.clientHeight
      };
    }
    return {
      w: d.body.clientWidth,
      h: d.body.clientHeight
    };
  }
}
