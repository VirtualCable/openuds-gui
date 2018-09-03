import { Router } from '@angular/router';
import { UdsApiService } from '../uds-api.service';

/**
 * Plugin manipulation class
 */
enum BrowserType {
    chrome = 0,
    safari,
    ie,
    firefox
}

export class Plugin {
    static transportsWindow: Window = null;

    constructor(private api: UdsApiService, private router: Router) {
    }

    private launchChrome(url: string) {
    }

    /**
     * Launches an UDS related url
     * @param url uds url to be lauhcned
     *
     * If the plugin cannon detect the correct launch of the UDS plugin, will redirect to plugin page
     * unless bypassPluginDetection is FALSE
     */
    private doLaunch(url: string) {
        let elem = document.getElementById('hiddenUdsLauncherIFrame');
        if (elem === null) {
            const i = document.createElement('div');
            i.id = 'testID';
            i.innerHTML = '<iframe id="hiddenUdsLauncherIFrame" src="about:blank" style="display:none"></iframe>';
            document.body.appendChild(i);
            elem = document.getElementById('hiddenUdsLauncherIFrame');
        }

        elem.focus();

        let launched = false;
        window.onblur = () => {
            console.log('Plugin seems to be installed');
            window.onblur = null;
            launched = true;
        };
        (<any>elem).contentWindow.location.href = url;
        window.setTimeout(() => {
            window.onblur = null;
            if (launched === false && this.api.config.bypassPluginDetection === false) {
                this.router.navigate(['client-download']);
            }
        }, 2800);
    }

    launchURL(url: string): void {
        if (url.substring(0, 7) === 'udsa://') {
            const params = url.split('//')[1].split('/');
            this.api.enabler(params[0], params[1]).subscribe(data => {
                if (data.error !== undefined && data.error !== '') {
                    // TODO: show the error correctly
                    alert(data.error);
                } else {
                    if (window.location.protocol === 'https:') {
                        // Ensures that protocol is https also for plugin, fixing if needed UDS provided info
                        data.url = data.url.replace('uds://', 'udss://');
                    }
                    this.doLaunch(data.url);
                }
            });
        } else {
            // Transport is http transport
            if (Plugin.transportsWindow !== null) {
                Plugin.transportsWindow.close();
            }
            Plugin.transportsWindow = window.open(url, 'uds_transport_window');
        }
    }
}
