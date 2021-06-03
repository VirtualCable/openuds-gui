import { HttpClient } from "@angular/common/http";
import { UDSApiServiceType } from "../uds-api.service-type";

declare var django: any;

/**
 * Plugin manipulation class
 */
enum BrowserType {
  chrome = 0,
  safari,
  ie,
  firefox,
}

export class Plugin {
  static transportsWindow = {};
  delay: number;

  constructor(private api: UDSApiServiceType) {
    this.delay = api.config.launcher_wait_time;
  }

  private showAlert(text: string, info: string, waitTime: number) {
    return this.api.gui.alert(
      django.gettext("Launching service"),
      '<p stype="font-size: 1.2rem;">' +
        text +
        '</p><p style="font-size: 0.8rem;">' +
        info +
        "</p>",
      waitTime
    );
  }

  /**
   * Launches an UDS related url
   * @param url uds url to be lauhcned
   *
   */
  private doLaunch(url: string) {
    let elem = document.getElementById("hiddenUdsLauncherIFrame");
    if (elem === null) {
      const i = document.createElement("div");
      i.id = "testID";
      i.innerHTML =
        '<iframe id="hiddenUdsLauncherIFrame" src="about:blank" style="display:none"></iframe>';
      document.body.appendChild(i);
      elem = document.getElementById("hiddenUdsLauncherIFrame");
    }
    (<any>elem).contentWindow.location.href = url;
  }

  launchURL(url: string): void {
    // If uds url...
    if (url.substring(0, 7) === "udsa://") {
      this.showAlert(
        django.gettext("Please wait until the service is launched."),
        django.gettext(
          "Remember that you will need the UDS client on your platform to access the service."
        ),
        this.delay
      );
      const params = url.split("//")[1].split("/");
      this.api.enabler(params[0], params[1]).subscribe((data) => {
        if (data.error) {
          // TODO: show the error correctly
          this.api.gui.alert(
            django.gettext("Error launching service"),
            data.error
          );
        } else {
          // Is HTTP access the service returned, or for UDS client?
          if (data.url.startsWith("/")) {
            this.launchURL(data.url);
            return;
          }
          if (window.location.protocol === "https:") {
            // Ensures that protocol is https also for plugin, fixing if needed UDS provided info
            data.url = data.url.replace("uds://", "udss://");
          }
          this.doLaunch(data.url);
        }
      });
    } else {
      // Custom url, http/https
      const alert = this.showAlert(
        django.gettext("Please wait until the service is launched."),
        django.gettext(
          "Your connection is being prepared. It will open on a new window when ready."
        ),
        this.delay * 2
      );
      this.api.transportUrl(url).subscribe((data) => {
        alert.close();
        if (data.url) {
          if (data.url.indexOf("o_s_w=") !== -1) {
            const osw = /(.*)&o_s_w=.*/.exec(data.url);
            window.location.href = osw[1];
          } else {
            // If the url contains "o_n_w", will open the url on a new window ALWAYS
            let name = "global";
            if (data.url.indexOf("o_n_w=") !== -1) {
              // Extract window name from o_n_w parameter if present
              const onw = /(.*)&o_n_w=([a-zA-Z0-9._-]*)/.exec(data.url);
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
              "uds_trans_" + name
            );
          }
        } else if (data.running) {
          // Already preparing, show some info and request wait a bit to user
          this.showAlert(
            django.gettext(
              "The service is now being prepared. (It is at #).".replace(
                "#",
                "" + data.running + "%"
              )
            ),
            django.gettext("Please, tray again in a few moments."),
            this.delay
          );
        } else {
          // error
          this.api.gui.alert(
            django.gettext("Error launching service"),
            data.error
          );
        }
      });
    }
  }
}
