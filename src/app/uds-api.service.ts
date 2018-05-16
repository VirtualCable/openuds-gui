import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Lang {
  id: string;
  name: string;
}

export interface Plugin {
  url: string;
  description: string;
  os: string;
}

@Injectable()
export class UdsApiService {

  constructor(private http: HttpClient) { }

  getCurrentLanguage(): string {
    return udsData.config.language;
  }

  getAvailableLanguages(): Lang[] {
    return udsData.config.available_languages;
  }

  getPlugins(): Plugin[] {
    return udsData.plugins;
  }
}
