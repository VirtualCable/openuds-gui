import { Component, OnInit } from '@angular/core';
import { UdsApiService, Plugin } from '../uds-api.service';

@Component({
  selector: 'uds-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private api: UdsApiService) { }

  ngOnInit() {
  }

}
