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
    // If uds url...
    if (url.substring(0, 7) === 'udsa://') {
      const params = url.split('//')[1].split('/');
      this.showAlert(
        django.gettext('Please wait until the service is launched.'),
        django.gettext(
          'Remember that you will need the UDS client on your platform to access the service.'
        ),
        0,
        // Now UDS tries to check status
        new Observable<boolean>((observer) => {
          const notifyError = () => {
            window.setTimeout(() => {
              this.showAlert(
                django.gettext('Error'),
                django.gettext(
                  'Error communicating with your service. Please, retry again.'
                ),
                5000
              );
            });
          };
          const checker = () => {
            this.api.status(params[0], params[1]).subscribe(
              (data) => {
                if (data.status === 'ready') {
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
                notifyError();
              }
            );
          };
          window.setTimeout(checker);
        })
      );
      this.api.enabler(params[0], params[1]).subscribe((data) => {
        if (data.error) {
          // TODO: show the error correctly
          this.api.gui.alert(
            django.gettext('Error launching service'),
            data.error
          );
        } else {
          // Is HTTP access the service returned, or for UDS client?
          if (data.url.startsWith('/')) {
            this.launchURL(data.url);
            return;
          }
          if (window.location.protocol === 'https:') {
            // Ensures that protocol is https also for plugin, fixing if needed UDS provided info
            data.url = data.url.replace('uds://', 'udss://');
          }
          this.doLaunch(data.url);
        }
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
          const notifyError = (error: string = null) => {
            window.setTimeout(() => {
              this.showAlert(
                django.gettext('Error'),
                error || django.gettext(
                  'Error communicating with your service. Please, retry again.'
                ),
                5000
              );
            });
          };
          const checker = () => {
            this.api.transportUrl(url).subscribe(
              (data) => {
                if (data.url) {
                  observer.next(true);
                  observer.complete();  // Notify window to close...
                  if (data.url.indexOf('o_s_w=') !== -1) {
                    window.location.href = data.url;
                  } else {
                    // If the url contains "o_n_w", will open the url on a new window ALWAYS
                    let name = 'global';
                    if (data.url.indexOf('o_n_w=') !== -1) {
                      // Extract window name from o_n_w parameter if present
                      const onw = /.*o_n_w=([a-zA-Z0-9._-]*)/.exec(data.url);
                      if (onw) {
                        name = onw[1];
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
                notifyError();
              }
            );
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
