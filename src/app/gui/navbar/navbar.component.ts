import { Component, OnInit } from '@angular/core';
import { UdsApiService } from '../../uds-api.service';
import { Lang } from '../../types/config';

@Component({
  selector: 'uds-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  lang: Lang; // Current language
  langs: Lang[]; // Available languages
  isNavbarCollapsed = true;

  constructor(public api: UdsApiService) {
    const lang = api.config.language;
    // Add "non current lang" to list
    this.langs = [];
    for (const l of api.config.available_languages) {
      if (l.id === lang) {
        this.lang = l;
      } else {
        this.langs.push(l);
      }
    }
  }

  ngOnInit() {
  }

  changeLang(to: Lang): boolean {
    // alert(document.getElementById('form_language'));
    this.lang = to;
    document.getElementById('id_language').attributes['value'].value = to.id;
    // alert(document.getElementById('id_language').attributes['value'].value);
    (<any>document.getElementById('form_language')).submit();
    return false;
  }

  admin() {
    window.location.href = this.api.config.urls.admin;
  }

}
