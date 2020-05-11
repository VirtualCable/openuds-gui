import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../../uds-api.service';

@Component({
  selector: 'uds-staff-info',
  templateUrl: './staff-info.component.html',
  styleUrls: ['./staff-info.component.css']
})
export class StaffInfoComponent implements OnInit {

  constructor(public api: UDSApiService) { }

  ngOnInit(): void {
  }

}
