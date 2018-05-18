import { Component, OnInit } from '@angular/core';
import { UdsApiService, Lang } from '../uds-api.service';

@Component({
  selector: 'uds-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  lang: string; // Current language
  langs: Lang[]; // Available languages
  isNavbarCollapsed = true;

  constructor(public api: UdsApiService) {
    const lang = api.currentLanguage;
    // Add "non current lang" to list
    this.langs = [];
    for (const l of api.availableLanguages) {
      if (l.id === lang) {
        this.lang = l.name;
      } else {
        this.langs.push(l);
      }
    }
  }

  ngOnInit() {
  }

}
