import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

@Pipe({
  name: 'safeHtml',
  standalone: false,
})
export class SafeHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: any, _args?: any): any {
    // Sanitize untrusted HTML with DOMPurify (a real HTML parser): strips script
    // elements, event handler attributes and javascript: URIs while keeping safe
    // formatting tags. Regex-based sanitization is not robust against bypasses.
    const clean = DOMPurify.sanitize(value ?? '');
    return this.sanitizer.bypassSecurityTrustHtml(clean);
  }
}
