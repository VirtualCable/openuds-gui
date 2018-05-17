import { Component, OnInit } from '@angular/core';
import { UdsApiService, Plugin } from '../uds-api.service';
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
    if (this.api.userLoggedIn() === false) {
      this.router.navigate(['login']);
    }
  }

}
