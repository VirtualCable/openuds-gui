import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../uds-api.service';
import { Downloadable } from '../../types/config';

@Component({
  selector: 'uds-client-download',
  templateUrl: './client-download.component.html',
  styleUrls: ['./client-download.component.scss']
})
export class ClientDownloadComponent implements OnInit {

  constructor(public api: UDSApiService) {
  }

  ngOnInit() {
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
