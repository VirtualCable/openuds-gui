import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JSONService, JSONTransport } from '../../../types/services';
import { UDSApiService } from '../../../services/uds-api.service';

const MAX_NAME_LENGTH = 32;

@Component({
    selector: 'uds-service',
    templateUrl: './service.component.html',
    styleUrls: ['./service.component.scss'],
    standalone: false
})
export class ServiceComponent implements OnInit {
  @Input() service: JSONService = {} as JSONService;

  isFavorite: boolean = false;
  @Output() favoriteChanged = new EventEmitter<{serviceId: string, isFavorite: boolean}>();

  get favoriteEnabled(): boolean {
    // Change 'favoriteEnabled' to the actual property name in config if different
    return (this.api.config as any).enable_favorite_services === true;

  }

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
    if (this.isFavorite) {
      klass.push('favorite');
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


  ngOnInit() {
    // Initialize the favorite state from localStorage
    const favs = JSON.parse(localStorage.getItem('favoriteServices') || '[]');
    this.isFavorite = favs.includes(this.service.id);
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    // Persist in localStorage
    let favs: string[] = [];
    try {
      favs = JSON.parse(localStorage.getItem('favoriteServices') || '[]');
    } catch {}
    if (this.isFavorite) {
      if (!favs.includes(this.service.id)) favs.push(this.service.id);
    } else {
      favs = favs.filter(id => id !== this.service.id);
    }
    localStorage.setItem('favoriteServices', JSON.stringify(favs));
    // Emit event so parent can react
    this.favoriteChanged.emit({serviceId: this.service.id, isFavorite: this.isFavorite});
    // Refresh screen if added or removed from favorites
    if (this.isFavorite || !this.isFavorite) {
      window.location.reload();
    }
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
    return (
      this.service.maintenance === false &&
      this.service.not_accesible === false &&
      (this.hasActions() || this.showTransportsMenu())
    );
  }

  notifyNotLaunching(message: string) {
    this.api.gui.alert('<p align="center"><b>' + django.gettext('Launcher') + '</b></p>', message);
  }

  async launch(transport: JSONTransport | null) {
    if (this.service.maintenance) {
      this.notifyNotLaunching(django.gettext('Service is in maintenance and cannot be launched'));
    } else if (this.service.not_accesible) {
      const calendarDeniedText = this.service.custom_calendar_text || this.api.config.messages.calendar_denied;

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
      if (this.service.custom_message_text !== null && this.service.custom_message_text !== undefined) {
        if (
          (await this.api.gui.yesno(
            django.gettext('Service message'),
            this.service.custom_message_text + '<br/><p>' + django.gettext('Press "Yes" to continue, or "No" to cancel') + '</p>'
          )) === false
        ) {
          return;
        }
        console.debug('Launching service with transport', transport);
      }
      this.api.executeCustomJSForServiceLaunch();
      this.api.launchURL(transport.link);
    }
  }

  async action(type: string) {
    const title =
      (type === 'release' ? django.gettext('Release service: ') : django.gettext('Reset service: ')) +
      ' ' +
      this.serviceName;
    const action = type === 'release' ? django.gettext('Service released') : django.gettext('Service reseted');
    if ((await this.api.gui.yesno(title, django.gettext('Are you sure?'))) === false) {
      return;
    }
    this.api.action(type, this.service.id).then((service) => {
      if (service) {
        this.api.gui.alert(title, action);
      }
    });
  }
}
