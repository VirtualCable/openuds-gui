import { Directive, OnInit, ElementRef, inject } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'uds-translate',
  standalone: false,
})
export class TranslateDirective implements OnInit {
  private el = inject(ElementRef);

  ngOnInit() {
    // Simply substitute innter html with translation

    this.el.nativeElement.innerHTML = django.gettext(this.el.nativeElement.innerHTML.trim());
  }
}
