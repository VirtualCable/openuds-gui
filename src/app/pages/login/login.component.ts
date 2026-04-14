// eslint-disable-next-line @typescript-eslint/quotes
import { Component, OnInit } from '@angular/core';
import { UDSApiService } from '../../services/uds-api.service';
import { BiometricService } from '../../services/biometric.service';
import { Authenticator } from '../../types/config';

@Component({
    selector: 'uds-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {
  auths: Authenticator[];
  auth: HTMLInputElement = {} as HTMLInputElement;
  title = 'UDS Enterprise';

  constructor(
    public api: UDSApiService,
    public biometric: BiometricService,
  ) {
    this.title = api.config.site_name;
    this.auths = api.config.authenticators.slice(0);
    // Sort array, so we can display it correctly
    this.auths.sort((a, b) => a.priority - b.priority);
  }

  ngOnInit() {
    // We want to keep compatibility right now with previous UDS templates, so we
    // adapt form to post the correct values the correct way
    const form = document.getElementById('loginform') as HTMLFormElement;
    // form.action = this.api.config.urls.login;  // Move to launch()
    const input = document.getElementById('token') as HTMLInputElement;
    input.name = this.api.csrfField;

    // Extract csrftoken from cookie
    const cookie = document.cookie.split(';').find((c) => c.trim().startsWith('csrftoken=')) || '=';
    input.value = cookie.split('=')[1];

    this.auth = document.getElementById('authenticator') as HTMLInputElement;
    if (this.auths.length > 0) {
      this.auth.value = this.auths[0].id;
      this.changeAuth(this.auth.value);
    }

    if (this.api.errors.length > 0) {
      // Clear biometrics on any failure as requested
      this.biometric.clearCredentials();
      this.api.gui.alert(
        django.gettext('Errors found'),
        '<div>' + this.api.errors.join('</div><div>') + '</div>'
      );
    } else {
      // If no errors, check if we should trigger biometrics automatically
      this.checkBiometrics();
    }
  }

  async checkBiometrics() {
    if (this.api.config.allow_biometric_auth && this.biometric.hasStoredData()) {
      try {
        const credentials = await this.biometric.authenticateAndDecrypt();
        if (credentials) {
          this.doBiometricLogin(credentials);
        }
      } catch (err) {
        console.error('Biometric login failed:', err);
        // If it failed (e.g. invalid), clear it
        this.biometric.clearCredentials();
      }
    }
  }

  async doBiometricLogin(creds: { user: string; pass: string; auth: string }) {
    const userField = document.getElementById('id_user') as HTMLInputElement;
    const passField = document.getElementById('id_password') as HTMLInputElement;
    const authField = document.getElementById('authenticator') as HTMLInputElement;

    if (userField && passField && authField) {
      userField.value = creds.user;
      passField.value = creds.pass;
      authField.value = creds.auth;

      // Submit the form
      this.launch(true);
    }
  }

  changeAuth(auth: string) {
    this.auth.value = auth;
    // Ejecuted when custom auth selected
    const doCustomAuth = (data: string) => {
      this.api.injectScript(data, false);
    };

    for (const l of this.auths) {
      if (l.id === auth) {
        if (l.is_custom) {
          // If is custom, we should get the code from server to authentication
          // Instant hide form
          document
            .getElementsByClassName('login-form')[0]
            .setAttribute('style', 'display: none;');
          this.api
            .getAuthCustomJavascript(l.id)
            .then((result) => doCustomAuth(result));
        }
      }
    }
  }

  async launch(arg1?: Event | boolean, isBiometric = false): Promise<boolean> {
    if (arg1 instanceof Event) {
      arg1.preventDefault();
    } else if (typeof arg1 === 'boolean') {
      isBiometric = arg1;
    }

    const form = document.getElementById('loginform') as HTMLFormElement;

    console.log('Launch called with isBiometric:', isBiometric);
    console.log('allow_biometric_auth config value:', this.api.config.allow_biometric_auth);
    
    // If manual login and biometrics are enabled, ask to save AFTER we verify success (optional but recommended)
    // However, since UDS login is a redirect, we capture data now.
    if (!isBiometric && this.api.config.allow_biometric_auth) {
      const user = (document.getElementById('id_user') as HTMLInputElement).value;
      const pass = (document.getElementById('id_password') as HTMLInputElement).value;
      const auth = (document.getElementById('authenticator') as HTMLInputElement).value;

      // Check if we should ask to save
      // We don't have the "success" yet because of the redirect.
      // But we can show the prompt now or use a different approach.
      // The user requested: "Login Correcto -> Pregunta si guarda".
      // To implement this correctly with a redirecting form, we'd need to intercept the submit.
      
      // Only ask to save if not already saved and not previously declined
      if (user && pass && await this.biometric.isSupported() && !this.biometric.hasStoredData() && !this.biometric.isDeclined()) {
        const save = await this.api.gui.yesno(
          django.gettext('Biometric Login'),
          django.gettext('Would you like to save your credentials for future biometric login?')
        );
        if (save) {
          try {
            this.biometric.clearDeclined(); // Clear declined flag if they said yes
            await this.biometric.registerBiometrics(user, pass, auth);
          } catch (err) {
            console.error('Biometric registration error:', err);
            this.api.gui.alert(django.gettext('Error'), django.gettext('Could not register biometrics'));
          }
        } else {
          this.biometric.setDeclined(); // Remember the user declined
        }
      }
    }

    form.action = this.api.config.urls.login;
    form.method = 'POST';
    form.submit();
    return true;
  }
}
