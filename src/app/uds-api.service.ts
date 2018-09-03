import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, UDSConfig, Downloadable } from './types/config';
import { Observable } from 'rxjs';
import { JSONServicesInformation, JSONEnabledService } from './types/services';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class UdsApiService {
  readonly user: User;
  transportsWindow: Window;

  constructor(private http: HttpClient) {
    this.user = new User(udsData.profile);
    this.transportsWindow = null;
  }

  /**
   * Gets configuration data from uds.js file
   */
  get config(): UDSConfig {
    return udsData.config;
  }

  /**
   * Gets plugins list
   */
  get plugins(): Downloadable[] {
    return udsData.plugins;
  }

  enabler(serviceId: string, transportId: string) {
    const enabler = this.config.urls.enabler.replace('param1', serviceId).replace('param2', transportId);
    return this.http.get<JSONEnabledService>(enabler);
  }

  /**
   * Gets services information
   */
  getServicesInformation(): Observable<JSONServicesInformation> {
    return this.http.get<JSONServicesInformation>(this.config.urls.services);
  }

  /**
   * Executes custom javascript for service launch if it is available
   */
  executeCustomJSForServiceLaunch(): void {
    // Executes a defined JS on launch servic event if defined
    // this is in fact a hook
    if (udsData.customJSForServiceLaunch !== undefined) {
      // tslint:disable-next-line:no-eval
      eval(udsData.customJSForServiceLaunch);
    }
  }

  /**
   * Gets auth custom html code
   * @param authId if of the authenticator
   * @returns  Observable
   */
  getAuthCustomHtml(authId: string) {
    return this.http.get(this.config.urls.customAuth + authId, { responseType: 'text' });
  }

}
