import { Component, OnInit, Input } from '@angular/core';
import { JSONService } from '../../../types/services';
import { UDSApiService } from '../../../uds-api.service';

const MAX_NAME_LENGTH = 32;

@Component({
  selector: 'uds-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  constructor(private api: UDSApiService) { }

  @Input() service: JSONService;

  ngOnInit() {
  }

  get serviceImage() {
    return this.api.galleryImageURL(this.service.imageId);
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

  getTransportIcon(transId: string) {
    return this.api.transportIcon(transId);
  }


  hasActions() {
    return this.service.allow_users_remove || this.service.allow_users_reset;
  }

  hasManyTransports() {
    return this.service.transports.length > 1;
  }

  hasMenu() {
    return this.hasActions() || this.hasManyTransports();
  }

  notifyNotLaunching(message: string) {
    this.api.gui.alert(django.gettext('Launcher'), message);
  }

  launch() {
    if (this.service.maintenance ) {
      this.notifyNotLaunching(django.gettext('Service is in maintenance and cannot be launched'));
    }
    if (this.service.not_accesible) {
      this.notifyNotLaunching(django.gettext('Service has been restricted and cannot be launched'));
    }
    this.api.launchURL(this.service.transports[0].link);
  }
}
