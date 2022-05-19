import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, args?: any): any {
    // Allow html, disallow scripts, onclick, etc.
    value = value.replace(/<\s*script\s*/gi, '');
    // Remove if exists any javascript event
    // eslint-disable-next-line max-len
    value = value.replace(/onclick|onmouseover|onmouseout|onmousemove|onmouseenter|onmouseleave|onmouseup|onmousedown|onkeyup|onkeydown|onkeypress|onkeydown|onkeypress|onkeyup|onchange|onfocus|onblur|onload|onunload|onabort|onerror|onresize|onscroll/gi, '');
    // Remove if exists any javascript:
    value = value.replace(/javascript\s*\:/gi, '');

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
