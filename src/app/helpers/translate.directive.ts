import { Directive, OnInit, ElementRef, inject } from '@angular/core';

import { withLauncherName } from './brand';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'uds-translate',
  standalone: false,
})
export class TranslateDirective implements OnInit {
  private el = inject(ElementRef);

  ngOnInit() {
    // Simply substitute innter html with translation

    this.el.nativeElement.innerHTML = withLauncherName(
      django.gettext(this.el.nativeElement.innerHTML.trim())
    );
  }
}
