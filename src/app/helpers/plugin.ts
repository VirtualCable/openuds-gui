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
    browser: BrowserType;

    constructor(private api: UdsApiService) {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') !== -1) {
            if (ua.indexOf('chrome') !== -1) {
                this.browser = BrowserType.chrome;
            } else {
                this.browser = BrowserType.safari;
            }
        } else if (ua.indexOf('msie ') !== -1 || ua.indexOf('trident/') !== -1) {
            this.browser = BrowserType.ie;
        } else {
            this.browser = BrowserType.firefox;
        }
    }

    private launchChrome(url: string) {
    }

    private launchFirefox(url: string): boolean {
        let elem = document.getElementById('hiddenUdsLauncherIFrame');
        if (elem === null) {
            const i = document.createElement('div');
            i.id = 'testID';
            i.innerHTML = '<iframe id="hiddenUdsLauncherIFrame" src="about:blank" style="display:none"></iframe>';
            document.body.appendChild(i);
            elem = document.getElementById('hiddenUdsLauncherIFrame');
        }
        console.log('Launching ', url);
        try {
            (<any>elem).contentWindow.location.href = url;
        } catch (e) {
            if (e.name === 'NS_ERROR_UNKNOWN_PROTOCOL') {
                return false;
            }
        }
        return true;
    }

    private launchSafari(url: string): boolean {
        return false;
    }

    private launchIe(url: string): boolean {
        return false;
    }

    private doLaunch(url: string) {
        switch (this.browser) {
            case BrowserType.chrome:
                this.launchChrome(url);
                break;
            case BrowserType.firefox:
                this.launchFirefox(url);
                break;
            case BrowserType.ie:
                this.launchIe(url);
                break;
            case BrowserType.safari:
                this.launchSafari(url);
                break;
            default:
                window.location.href = url;
                break;
        }
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
                    if (this.api.config.bypassPluginDetection === false) {
                        this.doLaunch(data.url);
                    } else {
                        window.location.href = data.url;
                    }
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
