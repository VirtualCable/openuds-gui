import { Component, OnInit, Input } from '@angular/core';
import { JSONService, JSONTransport } from '../../../types/services';
import { UDSApiService } from '../../../uds-api.service';

declare const django: any;

const MAX_NAME_LENGTH = 32;

@Component({
  selector: 'uds-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent implements OnInit {
  @Input() service: JSONService = {} as JSONService;

  constructor(private api: UDSApiService) {}

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
    if (this.service.to_be_replaced !== null) {
      return this.service.to_be_replaced_text;
    } else if (this.service.maintenance) {
      return django.gettext('Service is in maintenance');
    } else if (this.service.not_accesible) {
      // django.gettext('This service is currently not accessible due to schedule restrictions.');
      return this.service.custom_calendar_text;
    } else if (this.serviceName !== this.service.name) {
      return this.service.name;
    }
    return '';
  }

  get serviceClass() {
    const klass = ['service'];
    if (this.service.to_be_replaced != null) {
      klass.push('tobereplaced');
    } else if (this.service.maintenance) {
      klass.push('maintenance');
    } else if (this.service.not_accesible) {
      klass.push('forbidden');
    } else if (this.service.in_use) {
      klass.push('inuse');
    }
    if (klass.length > 1) {
      klass.push('alert');
    }

    return klass;
  }

  get serviceNameClass() {
    const klass = [];
    const len = Math.min(Math.floor((this.service.visual_name.length - 1) / 4) * 4, 28);
    if (len >= 16) {
      klass.push('small-' + len.toString());
    }
    return klass;
  }

  ngOnInit() {}

  getTransportIcon(transId: string) {
    return this.api.transportIconURL(transId);
  }

  hasActions() {
    return this.service.allow_users_remove || this.service.allow_users_reset;
  }

  showTransportsMenu() {
    return this.service.transports.length > 1 && this.service.show_transports;
  }

  hasMenu() {
    return (
      this.service.maintenance === false &&
      this.service.not_accesible === false &&
      (this.hasActions() || this.showTransportsMenu())
    );
  }

  notifyNotLaunching(message: string) {
    this.api.gui.alert('<p align="center"><b>' + django.gettext('Launcher') + '</b></p>', message);
  }

  launch(transport: JSONTransport|null) {
    if (this.service.maintenance) {
      this.notifyNotLaunching(django.gettext('Service is in maintenance and cannot be launched'));
    } else if (this.service.not_accesible) {
      const calendarDeniedText = this.service.custom_calendar_text || this.api.config.messages.calendarDenied;

      this.notifyNotLaunching(
        '<p align="center">' +
          django.gettext('This service is currently not accesible due to schedule restrictions.') +
          '</p><p align="center"><b>' +
          calendarDeniedText +
          '</b></p><p align="center">' +
          '</p>'
      );
    } else {
      if (transport === null || this.service.show_transports === false) {
        transport = this.service.transports[0];
      }
      this.api.executeCustomJSForServiceLaunch();
      this.api.launchURL(transport.link);
    }
  }

  action(type: string) {
    const title =
      (type === 'release' ? django.gettext('Release service: ') : django.gettext('Reset service: ')) +
      ' ' +
      this.serviceName;
    const action = type === 'release' ? django.gettext('Service released') : django.gettext('Service reseted');
    this.api.gui.yesno(title, django.gettext('Are you sure?')).then((val) => {
      if (val) {
        this.api.action(type, this.service.id).then((service) => {
          if (service) {
            this.api.gui.alert(title, action);
          }
        });
      }
    });
  }
}
