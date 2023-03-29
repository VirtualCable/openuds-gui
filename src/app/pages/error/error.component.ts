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
  error: string;
  returnUrl: string;

  constructor(public api: UDSApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.getError();
  }

  getError(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === '19') {
      this.returnUrl = '/mfa';
    } else {
      this.returnUrl = '/services';
    }
    this.error = '';
    // Request error string from UDS
    this.api.getErrorInformation(id).subscribe((errInfo) => {
      // Set error to errInfo.error + Hex code
      this.error = errInfo.error;
    });
  }
}
