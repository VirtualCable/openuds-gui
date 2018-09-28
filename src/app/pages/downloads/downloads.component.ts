import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../uds-api.service';

@Component({
  selector: 'uds-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css']
})
export class DownloadsComponent implements OnInit {

  constructor(public api: UDSApiService) { }

  ngOnInit() {
  }

  download(url: string) {
    window.location.href = url;
  }

  img(image: string) {
    return this.api.staticURL( 'modern/img/' + image + '.png');
  }

}
