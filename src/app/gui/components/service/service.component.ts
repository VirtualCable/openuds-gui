import { Component, OnInit, Input } from '@angular/core';
import { JSONService } from '../../../types/services';
import { UDSApiService } from '../../../uds-api.service';

const MAX_NAME_LENGTH = 56;

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
    if (v.length > MAX_NAME_LENGTH) {
      v = v.substring(0, MAX_NAME_LENGTH - 3) + '...';
    }
    return v;
  }

  get serviceTooltip() {
    if ( this.service.to_be_replaced !== null ) {
      return this.service.to_be_replaced_text;
    } else if (this.service.maintenance) {
      return django.gettext('Service is in maintenance');
    } else if (this.service.not_accesible) {
      return django.gettext('Service access is not allowed at this time');
    }
    return '';
  }

  get serviceClass() {
    const klass  = ['service'];
    if (this.service.to_be_replaced != null) {
      klass.push('tobereplaced');
    } else if (this.service.maintenance) {
      klass.push('maintenance');
    } else if (this.service.not_accesible) {
      klass.push('forbidden');
    }
    if (klass.length > 1 ) {
      klass.push('alert');
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
    return this.service.maintenance === false &&
      this.service.not_accesible === false &&
      (this.hasActions() || this.hasManyTransports())
    ;
  }

  notifyNotLaunching(message: string) {
    this.api.gui.alert('<p align="center"><b>' + django.gettext('Launcher') + '</b></p>', message);
  }

  launch() {
    if (this.service.maintenance ) {
      this.notifyNotLaunching(django.gettext('Service is in maintenance and cannot be launched'));
    } else if (this.service.not_accesible) {
      this.notifyNotLaunching('<p align="center">' +
      django.gettext('This service is currently not accesible due to schedule restrictions.') +
      '</p><p align="center"><b>' + django.gettext('Access limited by calendar') +
      '</b></p><p align="center">' + django.gettext('Please, retry access in a while.') +
      '</p>'
      );
    } else {
      this.api.launchURL(this.service.transports[0].link);
    }
  }
}
