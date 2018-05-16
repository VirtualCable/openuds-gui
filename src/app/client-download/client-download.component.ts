import { Component, OnInit } from '@angular/core';
import { UdsApiService, Plugin } from '../uds-api.service';

@Component({
  selector: 'uds-client-download',
  templateUrl: './client-download.component.html',
  styleUrls: ['./client-download.component.css']
})
export class ClientDownloadComponent implements OnInit {

  plugins: Plugin[];

  constructor(api: UdsApiService) {
    this.plugins = api.getPlugins();
  }

  ngOnInit() {
  }

}
