import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Lang {
  readonly id: string;
  readonly name: string;
}

export interface Authenticator {
  id: string;
  name: string;
  label: string;
  priority: number;
  is_custom: string;
}

// URLs related
export interface UDSUrls {
  readonly changeLang: string;
  readonly login: string;
  readonly logout: string;
  readonly customAuth: string;
}

export interface UDSConfig {
  language: string;
  available_languages: Lang[];
  authenticators: Authenticator[];
  os: string;
  csrf_field: string;
  csrf: string;
  urls: UDSUrls;
}

export interface Downloadable {
  readonly url: string;
  readonly description: string;
  readonly name: string;
}

export interface Profile {
  readonly user: string;
  readonly role: string;
}

// User related
export class User {
  readonly user: string;
  readonly role: string;

  constructor(profile: Profile) {
    this.user = profile.user;
    this.role = profile.role;
  }

  get isStaff(): boolean {
    return this.role === 'staff';
  }

  get isLogged(): boolean {
    return this.user != null;
  }
}

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
}
