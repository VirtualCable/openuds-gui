import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../services/uds-api.service';

@Component({
    selector: 'uds-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false
})
export class FooterComponent implements OnInit {

  constructor(public api: UDSApiService) {
  }

  ngOnInit() {
  }

}
