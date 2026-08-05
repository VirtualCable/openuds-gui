import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UDSApiService } from '../../services/uds-api.service';

@Component({
  selector: 'uds-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FooterComponent implements OnInit {
  constructor(public api: UDSApiService) {}

  ngOnInit() {}
}
