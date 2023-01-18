import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../../services/uds-api.service';

@Component({
  selector: 'uds-staff-info',
  templateUrl: './staff-info.component.html',
  styleUrls: ['./staff-info.component.scss']
})
export class StaffInfoComponent implements OnInit {

  constructor(public api: UDSApiService) { }

  ngOnInit(): void {
  }

}
