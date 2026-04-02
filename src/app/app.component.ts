import { Component, HostListener, OnInit } from '@angular/core';
import { UDSApiService } from './services/uds-api.service';

@Component({
  selector: 'uds-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  title = 'UDS';

  constructor(private api: UDSApiService) {}

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
    cookieconsent.initialise({
      palette: {
        popup: {
          background: '#343c66',
          text: '#dfdfe8',
        },
        button: {
          background: '#f71559',
        },
      },
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
