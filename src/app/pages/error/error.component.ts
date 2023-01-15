import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UDSApiService } from '../../uds-api.service';

declare const django: any;
declare const udsData: any;

@Component({
  selector: 'uds-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent implements OnInit {
  error = '';
  returnUrl = '/';

  constructor(public api: UDSApiService, private route: ActivatedRoute) {}

  async ngOnInit() {
    await this.getError();
  }

  async getError(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id') || '-1';
    if (id === '19') {  // 19 is MFA error, return to MFA
      this.returnUrl = '/mfa';
    }
    // Request error string from UDS
    this.error = (await this.api.getErrorInformation(id)).error;
  }
}
