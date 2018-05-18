import { Component, OnInit } from '@angular/core';
import { UdsApiService, Downloadable } from '../uds-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'uds-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  constructor(private api: UdsApiService, private router: Router) {
   }

  ngOnInit() {
    // Redirect, if not logged in, to login screen
    if (!this.api.user.isLogged) {
      this.router.navigate(['login']);
    }
  }

}
