import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../uds-api.service';

@Component({
  selector: 'uds-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(public api: UDSApiService) { }

  ngOnInit() {
  }

}
