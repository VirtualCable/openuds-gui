import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../uds-api.service';
import { Downloadable } from '../../types/config';

@Component({
  selector: 'uds-client-download',
  templateUrl: './client-download.component.html',
  styleUrls: ['./client-download.component.css']
})
export class ClientDownloadComponent implements OnInit {

  plugins: Downloadable[];

  constructor(public api: UDSApiService) {
  }

  ngOnInit() {
  }

  download(url) {
    window.location.href = url;
  }
}
