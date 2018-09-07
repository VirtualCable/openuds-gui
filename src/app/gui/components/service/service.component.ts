import { Component, OnInit, Input } from '@angular/core';
import { JSONService } from '../../../types/services';
import { UdsApiService } from '../../../uds-api.service';

const MAX_NAME_LENGTH = 32;

@Component({
  selector: 'uds-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  constructor(private api: UdsApiService) { }

  @Input() service: JSONService;

  ngOnInit() {
  }

  get serviceImage() {
    return this.api.galeryImageURL(this.service.imageId);
  }

  get serviceName() {
    let v = this.service.visual_name;
    if (v.length > MAX_NAME_LENGTH - 3) {
      v = v.substring(0, MAX_NAME_LENGTH - 3) + '...';
    }
    return v;
  }

  get serviceTooltip() {
    return this.service.name;
  }
}
