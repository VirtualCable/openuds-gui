import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../uds-api.service';
import {
  JSONServicesInformation,
  JSONGroup,
  JSONService,
} from '../../types/services';

declare const django: any;

class GroupedServices {
  services: JSONService[];

  constructor(public group: JSONGroup) {
    this.services = [];
  }
}

@Component({
  selector: 'uds-services-page',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent implements OnInit {
  servicesInformation: JSONServicesInformation;
  group: GroupedServices[];

  constructor(public api: UDSApiService) {}

  update(filter: string) {
    this.updateServices(filter);
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
    if (
      this.servicesInformation.autorun &&
      this.servicesInformation.services.length === 1
    ) {
      if (!this.servicesInformation.services[0].maintenance) {
        this.api.executeCustomJSForServiceLaunch();
        // Launch url
        this.api.launchURL(
          this.servicesInformation.services[0].transports[0].link
        );
        return true;
      } else {
        this.api.gui.alert(
          django.gettext('Warning'),
          django.gettext('Service is in maintenance and cannot be executed')
        );
      }
    }

    // TODO: remove this
    // this.plugin.launchURL(this.servicesInformation.services[0].transports[0].link);
    return false;
  }

  private loadServices() {
    // If restricted user, it's not allowed to see ALLL services
    if (this.api.user.isRestricted) {
      this.api.logout();
    }

    // Obtain services list
    this.api
      .getServicesInformation()
      .subscribe((result: JSONServicesInformation) => {
        this.servicesInformation = result;
        this.autorun();

        this.updateServices();
      });
  }

  private updateServices(filter: string = '') {
    // Fill up groupedServices
    this.group = [];

    let current: GroupedServices = null;
    this.servicesInformation.services
      .filter(
        (value) =>
          !filter ||
          value.visual_name.toLowerCase().includes(filter) ||
          value.group.name.toLowerCase().includes(filter)
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
  }
}
