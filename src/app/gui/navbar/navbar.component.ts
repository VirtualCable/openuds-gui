import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { UDSApiService } from '../../services/uds-api.service';
import { Lang } from '../../types/config';

@Component({
  selector: 'uds-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class NavbarComponent implements OnInit {
  api = inject(UDSApiService);

  lang: Lang = {} as Lang; // Current language
  langs: Lang[] = []; // Available languages
  style = ''; // Empty on start

  constructor() {
    const api = this.api;

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

  ngOnInit(): void {
    return;
  }

  changeLang(to: Lang): void {
    // alert(document.getElementById('form_language'));
    this.lang = to;
    const lang = document.getElementById('id_language');
    if (lang) {
      lang.setAttribute('value', to.id);
    }
    // Submit form form_language
    const form = document.getElementById('form_language');
    if (form) {
      (form as HTMLFormElement).submit();
    }
  }

  admin(): void {
    this.api.gotoAdmin();
  }

  logout(): void {
    this.api.logout();
  }

  toggleTheme(): void {
    this.api.toggleTheme();
  }
}
