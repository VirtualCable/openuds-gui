import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UDSApiService } from '../../services/uds-api.service';

@Component({
  selector: 'uds-launcher',
  templateUrl: './launcher.component.html',
  styleUrls: ['./launcher.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LauncherComponent implements OnInit {
  constructor(public api: UDSApiService) {}

  ngOnInit() {
    if (this.api.config.urls.launch) {
      this.api.launchURL(this.api.config.urls.launch);
    }
  }
}
