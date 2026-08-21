import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { UDSApiService } from '../../services/uds-api.service';

@Component({
  selector: 'uds-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AboutComponent implements OnInit {
  api = inject(UDSApiService);

  year = new Date().getFullYear();

  ngOnInit() {
    if (this.year < 2021) {
      this.year = 2021;
    }
  }
}
