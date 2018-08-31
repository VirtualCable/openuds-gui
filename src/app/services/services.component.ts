import { Component, OnInit } from '@angular/core';
import { UdsApiService } from '../uds-api.service';
import { Router } from '@angular/router';
import { JSONServicesInformation } from '../types/services';

@Component({
  selector: 'uds-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  servicesInformation: JSONServicesInformation;

  constructor(private api: UdsApiService, private router: Router) {
  }

  ngOnInit() {
    // Redirect, if not logged in, to login screen
    if (!this.api.user.isLogged) {
      this.router.navigate(['login']);
    }
    this.api.getServices().subscribe((result: JSONServicesInformation) => {
      this.servicesInformation = result;
      console.log(this.servicesInformation.services[0]);
    });
  }

}
