import { Directive, Input, Output, EventEmitter, ElementRef, HostListener, OnInit } from '@angular/core';

export interface Viewport {
  h: number;
  w: number;
}

// InfiniteScrollContext represents the context in which the directive will run.
//
// The default is 'document' and this will trigger your action when the end of
// your element has been reached relative to the documents scrollbar.
//
// If you use 'self', your action will be triggered when the end of your element
// has been reached relative to your elements own scrollbar.
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
    // This works for all browsers except IE8 and before
    if (win.innerWidth != null) {
      return {
        w: win.innerWidth,
        h: win.innerHeight
      };
    }

    // For IE (or any browser) in Standards mode
    let d = win.document;

    if (document.compatMode == 'CSS1Compat') {
      return {
        w: d.documentElement.clientWidth,
        h: d.documentElement.clientHeight
      };
    }

    // For browsers in Quirks mode
    return {
      w: d.body.clientWidth,
      h: d.body.clientHeight
    };
  }
}
