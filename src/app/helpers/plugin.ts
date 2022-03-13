import { Observable } from 'rxjs';
import { UDSApiServiceType } from '../uds-api.service-type';

declare const django: any;

/**
 * Plugin manipulation class
 */

export class Plugin {
  static transportsWindow = {};
  delay: number;

  constructor(private api: UDSApiServiceType) {
    this.delay = api.config.launcher_wait_time;
  }

  launchURL(url: string): void {
    let state = 'init';
    // Internal helper for notify errors
    const notifyError = (error?: any) => {
      let msg: string = django.gettext(
        'Error communicating with your service. Please, retry again.'
      );
      if (typeof error === 'string') {
        msg = error;
      } else if (error.status === 403) {
        // Session timeout
        msg = django.gettext('Your session has expired. Please, login again');
      }
      window.setTimeout(() => {
        this.showAlert(django.gettext('Error'), msg, 5000);
        if (error.status === 403) {
          window.setTimeout(() => {
            this.api.logout();
          }, 5000);
        }
      });
    };

    // If uds url...
    if (url.substring(0, 7) === 'udsa://') {
      const params = url.split('//')[1].split('/');
      const alert = this.showAlert(
        django.gettext('Please wait until the service is launched.'),
        django.gettext(
          'Remember that you will need the UDS client on your platform to access the service.'
        ),
        0,
        // Now UDS tries to check status
        new Observable<boolean>((observer) => {
          let readyTime = 0;
          const checker = () => {
            if (alert.componentInstance) {
              // Not closed dialog...
              this.api.status(params[0], params[1]).subscribe(
                (data) => {
                  if (data. status === 'ready') {
                    if (!readyTime) {
                      readyTime = Date.now(); // Milisecodns
                      alert.componentInstance.data.title = django.gettext(
                        'Service ready'
                      );
                      alert.componentInstance.data.body = django.gettext(
                        'Launching UDS Client, almost done.'
                      );
                    } else {
                      // If Component took too long...
                      if (Date.now() - readyTime > this.delay * 5) {
                        // Wait 5 times the default delay
                        alert.componentInstance.data.title =
                          django.gettext('Service ready') +
                          ' - ' +
                          django.gettext('UDS Client not launching');
                        alert.componentInstance.data.body =
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
                    }
                    window.setTimeout(checker, this.delay); // Recheck after delay seconds
                  } else if (data.status === 'accessed') {
                    alert.componentInstance.data.body = django.gettext(
                      'Machine ready, waiting for UDS Client'
                    );
                    observer.next(true);
                    observer.complete();
                  } else if (data.status === 'running') {
                    window.setTimeout(checker, this.delay); // Recheck after delay seconds
                  } else {
                    observer.next(true);
                    observer.complete();
                    notifyError();
                  }
                },
                (error) => {
                  observer.next(true);
                  observer.complete();
                  notifyError(error);
                }
              );
            }
          };
          const init = () => {
            if( state === 'init' ) {
              window.setTimeout(init, this.delay);
            } else if( state === 'error' || state === 'stop' ) {
              return;
            } else {
              window.setTimeout(checker);
            }
          };
          window.setTimeout(init);
        })
      );

      this.api.enabler(params[0], params[1]).subscribe((data) => {
        if (data.error) {
          state = 'error';
          // TODO: show the error correctly
          this.api.gui.alert(
            django.gettext('Error launching service'),
            data.error
          );
        } else {
          // Is HTTP access the service returned, or for UDS client?
          if (data.url.startsWith('/')) {
            // If running message window, close it first...
            if ( alert.componentInstance ) {
              alert.componentInstance.close();
            }
            state = 'stop';
            this.launchURL(data.url);
            return;
          }
          if (window.location.protocol === 'https:') {
            // Ensures that protocol is https also for plugin, fixing if needed UDS provided info
            data.url = data.url.replace('uds://', 'udss://');
          }
          state = 'enabled';
          this.doLaunch(data.url);
        }
      }, (error) => {
        // Any error on requests will redirect to login
        this.api.logout();
      });
    } else {
      // Custom url, http/https
      const alert = this.showAlert(
        django.gettext('Please wait until the service is launched.'),
        django.gettext(
          'Your connection is being prepared. It will open on a new window when ready.'
        ),
        0,
        // Now UDS tries to check status before closing dialog...
        new Observable<boolean>((observer) => {
          const checker = () => {
            if (alert.componentInstance) {
              // Not closed dialog...
              this.api.transportUrl(url).subscribe(
                (data) => {
                  if (data.url) {
                    observer.next(true);
                    observer.complete(); // Notify window to close...
                    if (data.url.indexOf('o_s_w=') !== -1) {
                      const osw = /(.*)&o_s_w=.*/.exec(data.url);
                      window.location.href = osw[1];
                    } else {
                      // If the url contains "o_n_w", will open the url on a new window ALWAYS
                      let name = 'global';
                      if (data.url.indexOf('o_n_w=') !== -1) {
                        // Extract window name from o_n_w parameter if present
                        const onw = /(.*)&o_n_w=([a-zA-Z0-9._-]*)/.exec(
                          data.url
                        );
                        if (onw) {
                          name = onw[2];
                          data.url = onw[1];
                        }
                      }
                      if (Plugin.transportsWindow[name]) {
                        Plugin.transportsWindow[name].close();
                      }
                      Plugin.transportsWindow[name] = window.open(
                        data.url,
                        'uds_trans_' + name
                      );
                    }
                  } else if (!data.running) {
                    observer.next(true);
                    observer.complete();
                    notifyError(data.error);
                  } else {
                    window.setTimeout(checker, this.delay); // Recheck after 5 seconds
                  }
                },
                (error) => {
                  observer.next(true);
                  observer.complete();
                  notifyError(error);
                }
              );
            }
          };
          window.setTimeout(checker);
        })
      );
    }
  }
  private showAlert(
    text: string,
    info: string,
    waitTime: number,
    checker: Observable<boolean> = null
  ) {
    return this.api.gui.alert(
      django.gettext('Launching service'),
      '<p stype="font-size: 1.2rem;">' +
        text +
        '</p><p style="font-size: 0.8rem;">' +
        info +
        '</p>',
      waitTime,
      checker
    );
  }

  /**
   * Launches an UDS related url
   *
   * @param url uds url to be lauhcned
   */
  private doLaunch(url: string) {
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
    elem.contentWindow.location.href = url;
  }
}
