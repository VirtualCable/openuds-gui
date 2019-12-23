import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../uds-api.service';

@Component({
  selector: 'uds-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public api: UDSApiService) {
  }

  ngOnInit() {
  }

}
