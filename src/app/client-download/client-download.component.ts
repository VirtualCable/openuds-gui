import { Component, OnInit } from '@angular/core';
import { UdsApiService, Downloadable } from '../uds-api.service';

@Component({
  selector: 'uds-client-download',
  templateUrl: './client-download.component.html',
  styleUrls: ['./client-download.component.css']
})
export class ClientDownloadComponent implements OnInit {

  plugins: Downloadable[];

  constructor(public api: UdsApiService) {
  }

  ngOnInit() {
  }

}
