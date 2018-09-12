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

  get serviceClass() {
    const klass  = ['service'];
    if (this.service.maintenance) {
      klass.push('maintenance');
    } else if (this.service.not_accesible) {
      klass.push('forbidden');
    }
    return klass;
  }

  getTransportIcon(transId: string) {
    return this.api.transportIconURL(transId);
  }


  hasActions() {
    return this.service.allow_users_remove || this.service.allow_users_reset;
  }

  hasManyTransports() {
    return this.service.transports.length > 1;
  }

  hasMenu() {
    return this.service.maintenance === false && this.service.not_accesible === false && (this.hasActions() || this.hasManyTransports());
  }

  notifyNotLaunching(message: string) {
    this.api.gui.alert('<p align="center"><b>' + django.gettext('Launcher') + '</b></p>', message);
  }

  launch() {
    if (this.service.maintenance ) {
      this.notifyNotLaunching(django.gettext('Service is in maintenance and cannot be launched'));
      return;
    }
    if (this.service.not_accesible) {
      this.notifyNotLaunching('<p align="center">' +
      django.gettext('This service is currently not accesible due to schedule restrictions.') +
      '</p><p align="center"><b>' + django.gettext('Access limited by calendar') +
      '</b></p><p align="center">' + django.gettext('Please, retry access in a while.') +
      '</p>'
      );
      return;
    }
    this.api.launchURL(this.service.transports[0].link);
  }
}
