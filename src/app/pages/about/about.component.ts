import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../services/uds-api.service';

@Component({
    selector: 'uds-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    standalone: false
})
export class AboutComponent implements OnInit {
  year = new Date().getFullYear();

  constructor(public api: UDSApiService) { }

  ngOnInit() {
    if (this.year < 2021) {
      this.year = 2021;
    }
  }

}
