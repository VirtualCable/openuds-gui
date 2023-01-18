import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, UDSConfig, Downloadable, Info } from '../types/config';
import { toPromise } from '../helpers/tools';
import { timeout } from 'rxjs/operators';


import {
  JSONServicesInformation,
  JSONEnabledService,
  JSONStatusService,
  JSONService,
  JSONTransportURLService,
  JSONErrorInformation,
} from '../types/services';
import { UDSGuiService } from './uds-gui.service';
import { Plugin } from '../helpers/plugin';

import { UDSApiServiceType } from '../types/uds-api-service';

import { environment } from '../../environments/environment';

const DARK_THEME = 'dark-theme';
const LIGHT_THEME = 'light-theme';
const TIMEOUT = 10000;


@Injectable()
export class UDSApiService implements UDSApiServiceType {
  readonly user: User;
  transportsWindow: Window | null = null;
  plugin: Plugin;

  constructor(private http: HttpClient, public gui: UDSGuiService, public router: Router) {
    this.user = new User(udsData.profile);
    this.plugin = new Plugin(this);
  }
  /**
   * Gets configuration data from uds.js file
   */
  get config(): UDSConfig {
    return udsData.config;
  }

  get csrfField(): string {
    return csrf.csrfField;
  }

  get csrfToken(): string {
    return csrf.csrfToken;
  }

  /**
   * Gets staff information
   */
  get staffInfo(): Info | undefined {
    return udsData.info;
  }

  /**
   * Gets plugins list
   */
  get plugins(): Downloadable[] {
    return udsData.plugins;
  }

  /**
   * Gets actors list
   */
  get actors(): Downloadable[] {
    return udsData.actors;
  }

  /**
   * Actor errors. Empty array it no errors.
   *
   * @readonly
   * @type {string[]}
   * @memberof UDSApiService
   */
  get errors(): string[] {
    return udsData.errors;
  }

  /* Client enabler */
  async enabler(serviceId: string, transportId: string): Promise<JSONEnabledService> {
    const enabler = this.config.urls.enabler.replace('param1', serviceId).replace('param2', transportId);
    return toPromise(this.http.get<JSONEnabledService>(enabler));
  }

  /* Check userService status */
  async status(serviceId: string, transportId: string): Promise<JSONStatusService> {
    const status = this.config.urls.status.replace('param1', serviceId).replace('param2', transportId);
    return toPromise(this.http.get<JSONStatusService>(status));
  }

  /* Services resetter */
  async action(action: string, serviceId: string): Promise<JSONService> {
    const actionURL = this.config.urls.action.replace('param1', serviceId).replace('param2', action);
    return toPromise(this.http.get<JSONService>(actionURL));
  }

  async transportUrl(url: string): Promise<JSONTransportURLService> {
    return toPromise(this.http.get<JSONTransportURLService>(url));
  }

  async updateTransportTicket(
    ticketId: string,
    scrambler: string,
    username: string,
    password: string,
    domain: string
  ): Promise<any> {
    const url = this.config.urls.updateTransportTicket.replace('param1', ticketId).replace('param2', scrambler);
    return toPromise(
      this.http.post<any>(url, {
        username,
        password,
        domain,
      })
    );
  }

  /* Images & static related */
  galleryImageURL(imageId: string) {
    return this.config.urls.galleryImage.replace('param1', imageId);
  }

  transportIconURL(transportId: string) {
    return this.config.urls.transportIcon.replace('param1', transportId);
  }

  staticURL(url: string) {
    if (environment.production) {
      return this.config.urls.static + url;
    } else {
      return '/static/' + url;
    }
  }

  /**
   * Gets services information
   */
  async getServicesInformation(): Promise<JSONServicesInformation> {
    return toPromise(this.http.get<JSONServicesInformation>(this.config.urls.services));
  }

  /**
   * Gets error string from a code
   */
  async getErrorInformation(errorCode: string): Promise<JSONErrorInformation> {
    return toPromise(this.http.get<JSONErrorInformation>(this.config.urls.error.replace('9999', errorCode)));
  }

  /**
   * Executes custom javascript for service launch if it is available
   */
  executeCustomJSForServiceLaunch(): void {
    // Executes a defined JS on launch servic event if defined
    // this is in fact a hook
    if (udsData.customJSForServiceLaunch !== undefined) {
      // eslint-disable-next-line no-eval
      eval(udsData.customJSForServiceLaunch);
    }
  }

  gotoAdmin() {
    window.location.href = this.config.urls.admin;
  }

  logout() {
    window.location.href = this.config.urls.logout;
  }

  async download(url: string): Promise<void> {
    // Launch the download
    // Create an iframe and set the src to the url
    // This will trigger the download
    // First, loof for an existing download iframe
    let iframe = document.getElementById('download') as HTMLIFrameElement;
    // If not found, create it
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'download';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }
    // Set the src to the url
    iframe.src = url;
    // onload in iframe will only be triggered if an html page is downloaded. If it is loaded, it's not a download
    iframe.onload = () => {
      alert('Error downloading file. Please try again later.');
    };
    //window.location.href = url;
  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  launchURL(udsURL: string): void {
    this.plugin.launchURL(udsURL);
  }

  /**
   * Gets auth custom html code
   *
   * @param authId if of the authenticator
   * @returns  Observable
   */
  async getAuthCustomJavascript(authId: string): Promise<string> {
    return toPromise(this.http.get(this.config.urls.customAuth + authId, { responseType: 'text' }));
  }

  // Switch dark/light theme
  switchTheme(dark: boolean): void {
    const body = document.getElementsByTagName('html')[0];
    [DARK_THEME, LIGHT_THEME].forEach((cls) => {
      if (body.classList.contains(cls)) {
        body.classList.remove(cls);
      }
    });
    body.classList.add(dark ? DARK_THEME : LIGHT_THEME);
  }
}
