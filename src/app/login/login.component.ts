import { Component, OnInit } from '@angular/core';
import { UdsApiService } from '../uds-api.service';
import { Authenticator } from '../types/config';

@Component({
  selector: 'uds-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  auths: Authenticator[];
  visible: boolean;

  constructor(public api: UdsApiService) {
    this.auths = api.config.authenticators.slice(0);
    // Sort array, so we can display it correctly
    this.auths.sort((a, b) => a.priority - b.priority);
  }

  ngOnInit() {
    // We want to keep compatibility right now with previous UDS templates, so we
    // adapt form to post the correct values the correct way
    this.visible = true;
    const form = <HTMLFormElement>document.getElementById('loginform');
    if (form.action.slice(-1) !== '/') {
      form.action += '/';
    }
    const input = (<HTMLInputElement>document.getElementById('token'));
    input.name = this.api.config.csrf_field;
    input.value = this.api.config.csrf;
  }

  changeAuth(auth) {

    // Ejecuted when custom auth selected
    const doCustomAuth = (data: string) => {
      this.visible = false;
      // tslint:disable-next-line:no-eval
      eval(data);
    };

    for (const l of this.auths) {
      if (l.id === auth) {
        if (l.is_custom) { // If is custom, we should get the code from server to authentication

          this.api.getAuthCustomHtml(l.id)
            .subscribe(result => doCustomAuth(result));
        }
      }
    }
  }

}
