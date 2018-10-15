import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../uds-api.service';
import { Authenticator } from '../../types/config';

@Component({
  selector: 'uds-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  auths: Authenticator[];
  auth: HTMLInputElement;
  title = 'UDS Enterprise';

  constructor(public api: UDSApiService) {
    this.auths = api.config.authenticators.slice(0);
    // Sort array, so we can display it correctly
    this.auths.sort((a, b) => a.priority - b.priority);
  }

  ngOnInit() {
    // We want to keep compatibility right now with previous UDS templates, so we
    // adapt form to post the correct values the correct way
    const form = <HTMLFormElement>document.getElementById('loginform');
    form.action = this.api.config.urls.login;
    const input = (<HTMLInputElement>document.getElementById('token'));
    input.name = this.api.config.csrf_field;
    input.value = this.api.config.csrf;

    this.auth = (<HTMLInputElement>document.getElementById('authenticator'));
    if (this.auths.length > 0) {
      this.auth.value = this.auths[0].id;
    }
  }

  changeAuth(auth) {
    this.auth.value = auth;
    // Ejecuted when custom auth selected
    const doCustomAuth = (data: string) => {
      // tslint:disable-next-line:no-eval
      eval(data);
    };

    for (const l of this.auths) {
      if (l.id === auth) {
        if (l.is_custom) { // If is custom, we should get the code from server to authentication
          // Instant hide form
          document.getElementsByClassName('login-form')[0].setAttribute('style', 'display: none;');
          this.api.getAuthCustomHtml(l.id)
            .subscribe(result => doCustomAuth(result));
        }
      }
    }
  }

}
