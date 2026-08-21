import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UDSApiService } from '../../services/uds-api.service';

@Component({
  selector: 'uds-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ErrorComponent implements OnInit {
  api = inject(UDSApiService);
  private route = inject(ActivatedRoute);

  error = '';
  returnUrl = '/';

  async ngOnInit() {
    await this.getError();
  }

  async getError() {
    const id = this.route.snapshot.paramMap.get('id') || '-1';
    if (id === '19') {
      // 19 is MFA error, return to MFA
      this.returnUrl = '/mfa';
    }
    // Request error string from UDS
    this.error = (await this.api.getErrorInformation(id)).error;
  }
}
