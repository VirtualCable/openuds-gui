import { UDSApiServiceType } from '../uds-api.service-type';

declare var django: any;

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

    constructor(private api: UDSApiServiceType) {
    }

    /**
     * Launches an UDS related url
     * @param url uds url to be lauhcned
     *
     */
    private doLaunch(url: string) {
        this.api.gui.alert(
            django.gettext('Launching service'),
            '<p stype="font-size: 1.2rem;">' + django.gettext('Please wait') + '</p><p style="font-size: 0.8rem;">' +
            django.gettext('Remember that UDS Plugin is required in order for this service to be launched') +
            '</p>',
            5000
        );

        let elem = document.getElementById('hiddenUdsLauncherIFrame');
        if (elem === null) {
            const i = document.createElement('div');
            i.id = 'testID';
            i.innerHTML = '<iframe id="hiddenUdsLauncherIFrame" src="about:blank" style="display:none"></iframe>';
            document.body.appendChild(i);
            elem = document.getElementById('hiddenUdsLauncherIFrame');
        }
        (<any>elem).contentWindow.location.href = url;
    }

    launchURL(url: string): void {
        if (url.substring(0, 7) === 'udsa://') {
            const params = url.split('//')[1].split('/');
            this.api.enabler(params[0], params[1]).subscribe(data => {
                if (data.error !== undefined && data.error !== '') {
                    // TODO: show the error correctly
                    this.api.gui.alert(django.gettext('Error launching service'), data.error);
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
