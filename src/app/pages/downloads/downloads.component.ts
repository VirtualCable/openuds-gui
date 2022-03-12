import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../uds-api.service';
import { Downloadable } from '../../types/config';

@Component({
  selector: 'uds-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit {

  actors: Downloadable[];

  constructor(public api: UDSApiService) { }

  ngOnInit() {
    this.actors = [];  // Put legacy at end of downloadables...
    const legacy: Downloadable[] = [];
    this.api.actors.forEach(a => {
      if (a.name.includes('legacy')) {
        legacy.push(a);
      } else {
        this.actors.push(a);
      }
    });
    legacy.forEach(l => {
      this.actors.push(l);
    });
  }

  download(url: string) {
    window.location.href = url;
  }

  img(filename: string) {
    const extension = filename.split('.').pop().toLowerCase();
    let image = 'Linux';
    if (extension === 'exe') {
      image = 'Windows';
    } else if (extension === 'pkg') {
      // Not existing right now, but who knows :)
      image = 'MacOS';
    }

    return this.api.staticURL('modern/img/' + image + '.png');
  }

  css(filename: string): string[] {
    const styles = ['actor'];
    if (filename.toLowerCase().includes('legacy')) {
      styles.push('legacy');
    }
    return styles;
  }

}
