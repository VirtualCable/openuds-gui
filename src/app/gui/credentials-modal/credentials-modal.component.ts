import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

declare const django: any;

@Component({
  selector: 'uds-credentials-modal',
  templateUrl: './credentials-modal.component.html',
  styleUrls: ['./credentials-modal.component.scss']
})
export class CredentialsModalComponent {
  username: string;
  password: string;
  domain: string;
  labels = {
    username: django.gettext('Username'),
    password: django.gettext('Password'),
    domain: django.gettext('Domain'),
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: {username: string; domain: string}) {
    this.username = data.username;
    this.domain = data.domain;
    this.password = '';
  }
}

