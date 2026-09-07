import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { UDSApiService } from '../../services/uds-api.service';
import { Downloadable } from '../../types/config';

@Component({
  selector: 'uds-launcher-download',
  templateUrl: './launcher-download.component.html',
  styleUrls: ['./launcher-download.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LauncherDownloadComponent implements OnInit {
  api = inject(UDSApiService);

  ngOnInit() {}

  img(image: string) {
    return this.api.staticURL('modern/img/' + image + '.png');
  }

  css(launcher: Downloadable): string[] {
    const styles = ['plugin'];
    if (launcher.legacy) {
      styles.push('legacy');
    }
    return styles;
  }

  legacy(launcher: Downloadable): string {
    return launcher.legacy ? 'Legacy' : '';
  }
}
