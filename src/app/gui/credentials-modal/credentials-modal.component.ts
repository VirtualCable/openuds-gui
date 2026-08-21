import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'uds-credentials-modal',
  templateUrl: './credentials-modal.component.html',
  styleUrls: ['./credentials-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CredentialsModalComponent {
  data = inject<{
    username: string;
    domain: string;
  }>(MAT_DIALOG_DATA);

  username: string;
  password: string;
  domain: string;
  labels = {
    username: django.gettext('Username'),
    password: django.gettext('Password'),
    domain: django.gettext('Domain'),
  };

  constructor() {
    const data = this.data;

    this.username = data.username;
    this.domain = data.domain;
    this.password = '';
  }
}
