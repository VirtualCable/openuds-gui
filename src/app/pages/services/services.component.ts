import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../services/uds-api.service';
import { JSONServicesInformation, JSONGroup, JSONService } from '../../types/services';

const FAVORITES_GROUP: JSONGroup = {
  id: 'favorites',
  name: django.gettext('Favorites'),
  comments: '',
  imageUuid: 'x',
  priority: -1,
};

class GroupedServices {
  services: JSONService[];
  constructor(public group: JSONGroup) {
    this.services = [];
  }

  isFavoritesGroup(): boolean {
    return this.group.id === FAVORITES_GROUP.id;
  }
}

@Component({
  selector: 'uds-services-page',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  standalone: false,
})
export class ServicesComponent implements OnInit {
  servicesInformation: JSONServicesInformation = {
    autorun: false,
    services: [],
  };

  group: GroupedServices[] = [];

  constructor(public api: UDSApiService) {}

  update(filter: string) {
    this.updateServices(filter);
  }

  /**
   * Updates the favorites list when favorite status changes
   */
  onFavoriteChanged(event: { serviceId: string; isFavorite: boolean }) {
    // Reloads the list of services from the backend to reflect changes to favorites
    this.loadServices();
  }

  ngOnInit() {
    if (this.api.config.urls.launch) {
      this.api.logout();
    } else {
      this.loadServices(); // Loads service related data
    }
  }

  /**
   * check autorun of service and lauchs it if needed
   */
  private autorun(): boolean {
    // If autorun, and there is only one service, launch it
    if (this.servicesInformation.autorun && this.servicesInformation.services.length === 1) {
      if (!this.servicesInformation.services[0].maintenance) {
        this.api.executeCustomJSForServiceLaunch();
        // Launch url
        this.api.launchURL(this.servicesInformation.services[0].transports[0].link);
        return true;
      } else {
        this.api.gui.alert(
          django.gettext('Warning'),
          django.gettext('Service is in maintenance and cannot be executed'),
        );
      }
    }

    // TODO remove this
    // this.plugin.launchURL(this.servicesInformation.services[0].transports[0].link);
    return false;
  }

  private loadServices() {
    // If restricted user, it's not allowed to see ALLL services
    if (this.api.user.isRestricted) {
      this.api.logout();
    }

    // Obtain services list
    this.api.getServicesInformation().then((result: JSONServicesInformation) => {
      this.servicesInformation = result;
      this.autorun();

      this.updateServices();
    });
  }

  private updateServices(filter: string = '') {
    // Group services and favorites using the backend 'favorite' field
    let favoritesGroup: GroupedServices = new GroupedServices(FAVORITES_GROUP);
    this.group = [];

    let current: GroupedServices | null = null;

    this.servicesInformation.services
      .filter(
        (value) =>
          !filter ||
          value.visual_name.toLowerCase().includes(filter) ||
          value.group.name.toLowerCase().includes(filter),
      )
      .sort((a, b) => {
        if (a.group.priority !== b.group.priority) {
          return a.group.priority - b.group.priority;
        } else {
          if (a.group.id > b.group.id) {
            return 1;
          } else if (a.group.id < b.group.id) {
            return -1;
          }
        }
        return 0;
      })
      .forEach((element) => {
        // Add to favorites if 'favorite' field is true
        if (element.favorite) {
          favoritesGroup.services.push(element);
        }
        // ALWAYS add to original group
        if (current === null || element.group.id !== current.group.id) {
          if (current !== null) {
            this.group.push(current);
          }
          current = new GroupedServices(element.group);
        }
        current.services.push(element);
      });
    if (current !== null) {
      this.group.push(current);
    }
    // Insert favorite group at the beginning if there are favorites
    if (favoritesGroup.services.length > 0 && this.api.config.enable_favorite_services) {
      this.group.unshift(favoritesGroup);
    }
  }
}
