import { Component, OnInit, Input } from '@angular/core';
import { JSONService, JSONTransport } from '../../../types/services';
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
    if (this.service.to_be_replaced !== null) {
      return this.service.to_be_replaced_text;
    } else if (this.service.maintenance) {
      return django.gettext('Service is in maintenance');
    } else if (this.service.not_accesible) {
      return django.gettext('This service is currently not accessible due to schedule restrictions.');
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
    return this.service.maintenance === false &&
      this.service.not_accesible === false &&
      (this.hasActions() || this.showTransportsMenu())
      ;
  }

  notifyNotLaunching(message: string) {
    this.api.gui.alert('<p align="center"><b>' + django.gettext('Launcher') + '</b></p>', message);
  }

  launch(transport: JSONTransport) {
    if (this.service.maintenance) {
      this.notifyNotLaunching(django.gettext('Service is in maintenance and cannot be launched'));
    } else if (this.service.not_accesible) {
      this.notifyNotLaunching('<p align="center">' +
        django.gettext('This service is currently not accesible due to schedule restrictions.') +
        '</p><p align="center"><b>' + this.api.config.messages.calendarDenied +
        '</b></p><p align="center">' + django.gettext('Please, retry access in a while.') +
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
    const title = type === 'release' ? django.gettext('Release service: ') : django.gettext('Reset service: ') + this.serviceName;
    const action = type === 'release' ? django.gettext('Service released') : django.gettext('Service reseted');
    this.api.gui.yesno(
      title,
      django.gettext('Are you sure?')
    ).subscribe((val) => {
      if (val) {
        this.api.action(type, this.service.id).subscribe((service) => {
          if (service) {
            this.api.gui.alert(
              title,
              action
            );
          }
        });
      }
    });

  }
}
