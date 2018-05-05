import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Lang {
  id: string;
  name: string;
}

@Injectable()
export class UdsApiService {

  constructor(private http: HttpClient) { }

  getCurrentLanguage(): string {
    return udsConfig.language;
  }

  getAvailableLanguages(): Lang[] {
    const res: Lang[] = [];
    for (const entry of udsConfig.available_languages) {
      res.push(entry);
    }
    return res;
  }
}
