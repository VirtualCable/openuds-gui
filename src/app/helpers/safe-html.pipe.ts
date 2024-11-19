import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'safeHtml',
    standalone: false
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, args?: any): any {
    // Allow html, disallow scripts, onclick, etc.
    // if appears "script" tag, remove it and all following characters (to avoid XSS)
    value = value.replace(/<\s*script\s*/gi, '');
    // Remove if exists any javascript event
    // eslint-disable-next-line max-len
    // Remove all events: 'onclick', 'onmouseover', 'onmouseout',
    // 'onmousemove', 'onmouseenter', 'onmouseleave', 'onmouseup', 
    // 'onmousedown', 'onkeyup', 'onkeydown', 'onkeypress', 'onkeydown',
    // 'onkeypress', 'onkeyup', 'onchange', 'onfocus', 'onblur', 'onload', 'onunload', 'onabort', 'onerror', 'onresize', 'onscroll'
    value = value.replace(/(on|(on\w+\s*))=\s*['"]?[^'"]*['"]?/gi, '');

    // Remove if exists any javascript: reference
    value = value.replace(/javascript\s*\:/gi, '');

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
