import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../services/uds-api.service';
import { Downloadable } from '../../types/config';

@Component({
    selector: 'uds-downloads',
    templateUrl: './downloads.component.html',
    styleUrls: ['./downloads.component.scss'],
    standalone: false
})
export class DownloadsComponent implements OnInit {
  actors: Downloadable[] = [];

  constructor(public api: UDSApiService) {}

  ngOnInit() {
    // Sort legacy actors to the end of the list
    this.actors = []; // Put legacy at end of downloadables...
    const legacy: Downloadable[] = [];
    for (const a of this.api.actors) {
      if (a.legacy) {
        legacy.push(a);
      } else {
        this.actors.push(a);
      }
    }
    for (const l of legacy) {
      this.actors.push(l);
    }
  }

  img(filename: string) {
    const extension = (filename.split('.').pop() || '').toLowerCase();
    let image = 'Linux';
    if (extension === 'exe') {
      image = 'Windows';
    } else if (extension === 'pkg') {
      // Not existing right now, but who knows :)
      image = 'MacOS';
    }

    return this.api.staticURL('modern/img/' + image + '.png');
  }

  css(downloadable: Downloadable): string[] {
    const styles = ['actor'];
    if (downloadable.legacy) {
      styles.push('legacy');
    }
    return styles;
  }
}
