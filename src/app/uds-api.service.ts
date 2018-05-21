import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Lang {
  readonly id: string;
  readonly name: string;
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

export interface Authenticator {
  id: string;
  name: string;
  label: string;
  priority: number;
  is_custom: string;
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

// URLs related
export interface UDSUrls {
  readonly changeLang: string;
  readonly login: string;
  readonly logout: string;
}

@Injectable()
export class UdsApiService {
  readonly user: User;

  constructor(private http: HttpClient) {
    this.user = new User(udsData.profile);
   }

  get currentLanguage(): string {
    return udsData.config.language;
  }

  get availableLanguages(): Lang[] {
    return udsData.config.available_languages;
  }

  get plugins(): Downloadable[] {
    return udsData.plugins;
  }

  get urls(): UDSUrls {
    return udsData.config.urls;
  }

}
