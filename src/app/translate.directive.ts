import { Directive, OnInit, ElementRef } from '@angular/core';

declare const django: any;

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'uds-translate'
})
export class TranslateDirective implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit() {
    // Simply substitute innter html with translation

    this.el.nativeElement.innerHTML = django.gettext(this.el.nativeElement.innerHTML.trim());
  }

}
