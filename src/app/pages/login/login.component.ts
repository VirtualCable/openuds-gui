// eslint-disable-next-line @typescript-eslint/quotes
import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../uds-api.service';
import { Authenticator } from '../../types/config';

declare const django: any;

@Component({
  selector: 'uds-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  auths: Authenticator[];
  auth: HTMLInputElement;
  title = 'UDS Enterprise';

  constructor(public api: UDSApiService) {
    this.title = api.config.site_name;
    this.auths = api.config.authenticators.slice(0);
    // Sort array, so we can display it correctly
    this.auths.sort((a, b) => a.priority - b.priority);
  }

  ngOnInit() {
    // We want to keep compatibility right now with previous UDS templates, so we
    // adapt form to post the correct values the correct way
    const form = document.getElementById('loginform') as HTMLFormElement;
    form.action = this.api.config.urls.login;
    const input = document.getElementById('token') as HTMLInputElement;
    input.name = this.api.csrfField;
    input.value = this.api.csrfToken;

    this.auth = document.getElementById('authenticator') as HTMLInputElement;
    if (this.auths.length > 0) {
      this.auth.value = this.auths[0].id;
      this.changeAuth(this.auth.value);
    }

    if (this.api.errors.length > 0) {
      this.api.gui.alert(
        django.gettext('Errors found'),
        '<div>' + this.api.errors.join('</div><div>') + '</div>'
      );
    }
  }

  changeAuth(auth: string) {
    this.auth.value = auth;
    // Ejecuted when custom auth selected
    const doCustomAuth = (data: string) => {
      // eslint-disable-next-line no-eval
      eval(data);
    };

    for (const l of this.auths) {
      if (l.id === auth) {
        if (l.is_custom) {
          // If is custom, we should get the code from server to authentication
          // Instant hide form
          document
            .getElementsByClassName('login-form')[0]
            .setAttribute('style', 'display: none;');
          this.api
            .getAuthCustomHtml(l.id)
            .then((result) => doCustomAuth(result));
        }
      }
    }
  }

  launch(): boolean {
    const form = document.getElementById('loginform') as HTMLFormElement;
    form.submit();
    return true;
  }
}
