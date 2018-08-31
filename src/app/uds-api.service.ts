import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, UDSConfig, Downloadable } from './types/config';

@Injectable()
export class UdsApiService {
  readonly user: User;

  constructor(private http: HttpClient) {
    this.user = new User(udsData.profile);
   }

  get config(): UDSConfig {
    return udsData.config;
  }

  get plugins(): Downloadable[] {
    return udsData.plugins;
  }

  getAuthCustomHtml(authId) {
    return this.http.get(this.config.urls.customAuth + authId, {responseType: 'text'});
  }

  getServices() {
    return this.http.get(this.config.urls.services);
  }
}
