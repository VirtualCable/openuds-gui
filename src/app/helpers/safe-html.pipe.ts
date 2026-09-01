import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'safeHtml',
    standalone: false
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, _args?: any): any {
    // Allow html, disallow scripts, onclick, etc.
    // Remove complete <script>...</script> elements, including their content.
    // Note: \b and [^>]*> make nested/double tags like <script<script>...
    // be consumed as a single opening tag, so they cannot survive the cleanup.
    value = value.replace(/<\s*script\b[^>]*>[\s\S]*?<\/\s*script\s*>/gi, '');
    // Remove any leftover opening/closing script tags (self-closed, unclosed, </script>)
    value = value.replace(/<\s*\/?\s*script\b[^>]*>/gi, '');
    // Remove if exists any javascript event
    // Remove all events: 'onclick', 'onmouseover', 'onmouseout',
    // 'onmousemove', 'onmouseenter', 'onmouseleave', 'onmouseup', 
    // 'onmousedown', 'onkeyup', 'onkeydown', 'onkeypress', 'onkeydown',
    // 'onkeypress', 'onkeyup', 'onchange', 'onfocus', 'onblur', 'onload', 'onunload', 'onabort', 'onerror', 'onresize', 'onscroll'
    value = value.replace(/(on|(on\w+\s*))=\s*['"]?[^'"]*['"]?/gi, '');

    // Remove if exists any javascript: reference
    value = value.replace(/javascript\s*:/gi, '');

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
