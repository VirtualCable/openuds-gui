import { Component, HostListener, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { UDSApiService } from './services/uds-api.service';

@Component({
  selector: 'uds-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AppComponent implements OnInit {
  private api = inject(UDSApiService);

  title = 'UDS';

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.altKey && event.ctrlKey && event.key === 'b') {
      this.api.toggleTheme();
    }
  }

  ngOnInit() {
    // Switch theme if needed
    this.api.initTheme();

    const message =
      this.api.config.cookies_consent.text ||
      django.gettext('We use cookies to authenticate users and remember preferences.') +
        '<br/>' +
        django.gettext('If you do not agree, please') +
        ' <a class="cc-link" href="' +
        (this.api.config.cookies_consent.urls.leave || 'https://www.cookiesandyou.com') +
        '">' +
        django.gettext('leave this site') +
        '</a>.';

    // Initialize cookie consent
    // No palette: the banner takes its colours from the glass theme tokens in
    // styles.scss, so it follows the light/dark switch like the rest of the UI.
    cookieconsent.initialise({
      enabled: this.api.config.cookies_consent.enabled,
      layout: 'basic',
      position: 'bottom-right',
      theme: 'classic',
      //revokable: true,
      type: 'info',
      content: {
        message: message,
        dismiss: django.gettext('I Accept'),
        //deny: django.gettext('Refuse and leave'),
        //allow: django.gettext('I Accept'),
        link: django.gettext('Learn more'),
        href: this.api.config.cookies_consent.urls.more || 'https://www.cookiesandyou.com',
        policy: django.gettext('Cookie Policy'),
        close: '&#x274c;',
        target: '_blank',
      },
    });
  }
}
