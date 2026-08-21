import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { UDSApiService } from '../../services/uds-api.service';

@Component({
  selector: 'uds-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FooterComponent implements OnInit {
  api = inject(UDSApiService);

  ngOnInit() {}
}
