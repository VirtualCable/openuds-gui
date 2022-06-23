import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../uds-api.service';

declare const django: any;

@Component({
  selector: 'uds-mfa',
  templateUrl: './mfa.component.html',
  styleUrls: ['./mfa.component.scss'],
})
export class MfaComponent implements OnInit {
  constructor(public api: UDSApiService) {}

  ngOnInit() {
    // We want to keep compatibility right now with previous UDS templates, so we
    // adapt form to post the correct values the correct way
    const form = document.getElementById('mfaform') as HTMLFormElement;
    form.action = this.api.config.urls.mfa;
    const input = document.getElementById('token') as HTMLInputElement;
    input.name = this.api.csrfField;
    input.value = this.api.csrfToken;

    if (this.api.errors.length > 0) {
      this.api.gui.alert(
        django.gettext('Errors found'),
        '<div>' + this.api.errors.join('</div><div>') + '</div>'
      );
    }
  }

  launch(): boolean {
    const form = document.getElementById('mfaform') as HTMLFormElement;
    form.submit();
    return true;
  }
}
