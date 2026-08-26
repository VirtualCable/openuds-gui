import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { UDSApiService } from '../../../services/uds-api.service';

@Component({
  selector: 'uds-staff-info',
  templateUrl: './staff-info.component.html',
  styleUrls: ['./staff-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class StaffInfoComponent implements OnInit {
  api = inject(UDSApiService);

  ngOnInit(): void {}
}
