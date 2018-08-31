import { Component, OnInit } from '@angular/core';
import { UdsApiService } from '../uds-api.service';
import { Router } from '@angular/router';
import { JSONServicesInformation } from '../types/services';
import { Plugin } from '../helpers/plugin';

@Component({
  selector: 'uds-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  servicesInformation: JSONServicesInformation;
  plugin: Plugin;

  constructor(private api: UdsApiService, private router: Router) {
    this.plugin = new Plugin(api);
  }

  ngOnInit() {
    // Redirect, if not logged in, to login screen
    if (!this.api.user.isLogged) {
      this.router.navigate(['login']);
    }
    this.api.getServicesInformation().subscribe((result: JSONServicesInformation) => {
      this.servicesInformation = result;
      console.log(result);
      // If autorun, and there is only one service, launch it
      if (this.servicesInformation.autorun && this.servicesInformation.services.length === 1) {
        if (!this.servicesInformation.services[0].maintenance) {
          this.api.executeCustomJSForServiceLaunch();
          // Launch url
          this.plugin.launchURL(this.servicesInformation.services[0].transports[0].link);
        } else {
          // TODO: inform that the service is in maintenance and cannot be run
          alert(django.gettext('Service is in maintenance and cannot be executed'));
        }
      }
      this.plugin.launchURL(this.servicesInformation.services[0].transports[0].link);
    });
  }

}
