import { Directive, OnInit, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'uds-translate'
})
export class TranslateDirective implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit() {
    // Simply substitute outer html with translation
    this.el.nativeElement.outerHTML = django.gettext(this.el.nativeElement.innerHTML);
  }

}
