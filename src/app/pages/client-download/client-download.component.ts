import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../uds-api.service';
import { Downloadable } from '../../types/config';

declare const django: any;

@Component({
  selector: 'uds-client-download',
  templateUrl: './client-download.component.html',
  styleUrls: ['./client-download.component.css']
})
export class ClientDownloadComponent implements OnInit {

  constructor(public api: UDSApiService) {
  }

  ngOnInit() {
  }

  download(url: string) {
    window.location.href = url;
  }

  img(image: string) {
    return this.api.staticURL( 'modern/img/' + image + '.png');
  }

  css(client: Downloadable): string[] {
    const styles = ['plugin'];
    if (client.legacy) {
      styles.push('legacy');
    }
    return styles;
  }

  legacy(client: Downloadable): string {
    return client.legacy ? 'Legacy' : '';
  }

}
