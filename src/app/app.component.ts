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

  // blackTheme property, get value from Storage
  get blackTheme(): boolean {
    return this.api.getFromStorage('blackTheme') === 'true';
  }

  // blackTheme property, set value to Storage
  set blackTheme(value: boolean) {
    this.api.putOnStorage('blackTheme', value.toString());
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.altKey && event.ctrlKey && event.key === 'b') {
      this.blackTheme = !this.blackTheme;
      this.api.switchTheme(this.blackTheme);
    }
  }

  ngOnInit() {
    // Swith theme if needed
    this.api.switchTheme(this.blackTheme);

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
