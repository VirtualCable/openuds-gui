import { Observable } from 'rxjs';
import { UDSApiServiceType } from '../uds-api.service-type';
import { toPromise } from '../gui/uds-gui.service';
import { JSONTransportURLService } from '../types/services';

declare const django: any;

/**
 * Plugin manipulation class
 */

export class Plugin {
  static transportsWindow: any = {};
  delay: number;

  constructor(private api: UDSApiServiceType) {
    this.delay = api.config.launcher_wait_time;
  }

  async launchURL(url: string): Promise<void> {
    // If uds url...
    if (url.substring(0, 7) === 'udsa://') {
      await this.processUDSUrl(url);
    } else {
      await this.processExternalUrl(url);
    }
  }
  private async showAlert(
    text: string,
    info: string,
    waitTime: number,
  ) {
    return this.api.gui.alert(
      django.gettext('Launching service'),
      '<p stype="font-size: 1.2rem;">' +
        text +
        '</p><p style="font-size: 0.8rem;">' +
        info +
        '</p>',
      waitTime,
    );
  }

  /**
   * Launches an UDS related url
   *
   * @param url uds url to be lauhcned
   */
  private launchUDSUrl(url: string) {
    let elem: HTMLIFrameElement = document.getElementById(
      'hiddenUdsLauncherIFrame'
    ) as HTMLIFrameElement;
    if (elem === null) {
      const i = document.createElement('div');
      i.id = 'testID';
      i.innerHTML =
        '<iframe id="hiddenUdsLauncherIFrame" src="about:blank" style="display:none"></iframe>';
      document.body.appendChild(i);
      elem = document.getElementById(
        'hiddenUdsLauncherIFrame'
      ) as HTMLIFrameElement;
    }
    // Ensure all is ok
    if (elem === null) {
      throw new Error('Unable to create hidden iframe');
    }
    if (elem.contentWindow === null) {
      throw new Error('Unable to get content window');
    }
    elem.contentWindow.location.href = url;
  }

  /**
   * Process an UDS url
   *
   * @param url uds url (udsa://serviceId/transportId)
   * @returns nothing
   */
  private async processUDSUrl(url: string): Promise<void> {
    // Extract params from url, serviceId and transportId
    const params = url.split('//')[1].split('/');
    if (params.length !== 2) {
      await this.notifyError(django.gettext('Invalid UDS URL'));
      return;
    }
    const serviceId = params[0];
    const transportId = params[1];

    const dialog = await this.showAlert(
      django.gettext('Please wait until the service is launched.'),
      django.gettext(
        'Remember that you will need the UDS client on your platform to access the service.'
      ),
      0
    );
    let cancel = false;

    // Connect close dialog to "cancel" variable
    toPromise(dialog.afterClosed()).then(() => (cancel = true));

    let readyTime = -1;
    try {
      // Enable service
      const enabledData = await this.api.enabler(serviceId, transportId);
      if (enabledData.error) {
        throw enabledData.error;
      }
      // Is HTTP access the service returned, or for UDS client?
      if (enabledData.url.startsWith('/')) {
        dialog.close();
        await this.launchURL(enabledData.url);
        return;
      }
      if (window.location.protocol === 'https:') {
        // Ensures that protocol is https also for plugin, fixing if needed UDS provided info
        enabledData.url = enabledData.url.replace('uds://', 'udss://');
      }
      // Launches UDS Client, using an iframe
      this.launchUDSUrl(enabledData.url);

      while (!cancel) {
        const data = await this.api.status(serviceId, transportId);
        // Wait 5 times the default delay before notifying that client is not installed
        if (readyTime > 0 && Date.now() - readyTime > this.delay * 5) {
          dialog.componentInstance.data.title =
            django.gettext('Service ready') +
            ' - ' +
            django.gettext('UDS Client not launching');
          dialog.componentInstance.data.body =
            '<span style="color: red; ">' +
            django.gettext(
              'It seems that you don\'t have UDS Client installed. Please, install it from here:'
            ) +
            '&nbsp;</span>' +
            '<a href="' +
            this.api.config.urls.clientDownload +
            '">' +
            django.gettext('UDS Client Download') +
            '</a>';
        }
        if (data.status === 'ready') {
          if (readyTime === -1) {
            // Service is ready, wait for client, update dialog text
            readyTime = Date.now(); // Milisecodns
            dialog.componentInstance.data.title =
              django.gettext('Service ready');
            dialog.componentInstance.data.body = django.gettext(
              'Launching UDS Client, almost done.'
            );
          }
        } else if (data.status === 'accessed') {
          // stop checking
          dialog.close();
          cancel = true;
          continue;
        } else if (data.status !== 'running') {
          // Service is not running, close dialog and notify error
          dialog.close();
          await this.notifyError(data.status);
          cancel = true;
          continue;
        }
        // Wait a second before checking again
        await this.api.sleep(1000);
      }
    } catch (error) {
      dialog.close();
      await this.notifyError(error);
    }
  }

  private async processExternalUrl(url: string): Promise<void> {
    const dialog = await this.showAlert(
      django.gettext('Please wait until the service is launched.'),
      django.gettext(
        'Remember that you will need the UDS client on your platform to access the service.'
      ),
      0
    );
    let cancel = false;

    // Connect close dialog to "cancel" variable
    toPromise(dialog.afterClosed()).then(() => (cancel = true));
    try {
      while (!cancel) {
        const data = await this.api.transportUrl(url);
        if (data.url) {
          dialog.close();

          // if ask credentials, show dialog
          // Extract username and domain "&creds=username@domain"
          const creds = await this.processCredentials(data);
          if (creds !== null) {
            await this.api.updateTransportTicket(
              creds.ticket,
              creds.scrambler,
              creds.username,
              creds.password,
              creds.domain
            );
          }
          this.openWindow(data.url);
          cancel = true;
        } else {
          if (!data.running) {
            dialog.close();
            await this.notifyError();
            cancel = true;
          }
        }
      }
      // Wait a second before checking again
      await this.api.sleep(1000);
    } catch (error) {
      dialog.close();
      await this.notifyError(error);
    }
  }

  private async processCredentials(
    data: JSONTransportURLService
  ): Promise<any> {
    const url = data.url || '';
    if (url.indexOf('&creds=') !== -1) {
      const creds = url.split('&creds=')[1];
      let username = '';
      let domain = '';
      // Remove credentials from data.url input
      data.url = url.split('&creds=')[0];
      // From "data=..." extract ticket and scrambler that is ticket.scrambler
      const values = url.split('data=')[1].split('&')[0].split('.');
      const ticket = values[0];
      const scrambler = values[1];

      if (creds.indexOf('@') !== -1) {
        username = creds.split('@')[0];
        domain = creds.split('@')[1];
      } else {
        username = creds;
      }
      const result = await this.api.gui.askCredentials(username, domain);
      if (result.success === false) {
        throw new Error('User canceled credentials dialog');
      }
      return {
        ticket,
        scrambler,
        username: result.username,
        password: result.password,
        domain: result.domain,
      };
    }
    return null;
  }

  private openWindow(location: string): void {
    let wnd = 'global';
    // check if on same window or not
    if (location.indexOf('o_s_w=') !== -1) {
      const osw = /(.*)&o_s_w=.*/.exec(location);
      wnd = 'same';
      // @ts-ignore  osw is something for sure, checked before
      location = osw[1];
    } else {
      // If the url contains "o_n_w", will open the url on a new window ALWAYS
      if (location.indexOf('o_n_w=') !== -1) {
        // Extract window name from o_n_w parameter if present
        const onw = /(.*)&o_n_w=([a-zA-Z0-9._-]*)/.exec(location);
        if (onw) {
          wnd = onw[2];
          location = onw[1];
        }
      }
    }

    if (wnd === 'same') {
      window.location.href = location;
    } else {
      if (Plugin.transportsWindow[wnd]) {
        Plugin.transportsWindow[wnd].close();
      }
      Plugin.transportsWindow[wnd] = window.open(location, 'uds_trans_' + wnd);
    }
  }

  private async notifyError(error?: any): Promise<void> {
    let msg: string = django.gettext(
      'Error communicating with your service. Please, retry again.'
    );
    if (typeof error === 'string') {
      msg = error;
    } else if (error instanceof Error) {
      msg = error.message;
    } else if (error.status === 403) {
      // Session timeout
      msg = django.gettext('Your session has expired. Please, login again');
    }
    await this.showAlert(django.gettext('Error'), msg, 5000);
    if (error.status === 403) {
      this.api.logout();
    }
  }
}
