import { Component, OnInit } from '@angular/core';
import { UdsApiService, Authenticator } from '../uds-api.service';

@Component({
  selector: 'uds-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  auths: Authenticator[];

  constructor(public api: UdsApiService) {
    this.auths = api.config.authenticators.slice(0);
    // Sort array, so we can display it correctly
    this.auths.sort((a, b) => a.priority - b.priority);
  }

  ngOnInit() {
  }

  changeAuth(auth) {
    function doChangeAuth(result: string) {
      alert(result);
    }

    for (const l of this.auths) {
      if (l.id === auth) {
        if (l.is_custom) { // If is custom, we should get the code from server to authentication

          this.api.getAuthCustomHtml(l.id)
            .subscribe(result => doChangeAuth(result));
        }
      }
    }
  }

}
