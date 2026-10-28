import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { UDSApiService } from '../../services/uds-api.service';
import { BiometricService } from '../../services/biometric.service';
import { Authenticator } from '../../types/config';

const DECLINED_KEY = 'uds_biometric_declined';
// Only the automatic prompt on page load honours this flag; the manual button
// keeps working. Cleared by a successful biometric login, by a new
// registration or by the hint wipe that follows a failed login.
const AUTO_PAUSED_KEY = 'uds_biometric_auto_paused';

// Cancel, timeout or another authenticator in the way: the credential is still valid
function isTransientWebAuthnError(err: unknown): boolean {
  return err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'AbortError');
}

@Component({
  selector: 'uds-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LoginComponent implements OnInit {
  api = inject(UDSApiService);
  biometric = inject(BiometricService);

  auths: Authenticator[];
  auth: HTMLInputElement = {} as HTMLInputElement;
  title = 'UDS Enterprise';
  // Hints (username + authenticator only) of users with a biometric vault on this browser
  biometricHints: { username: string; auth_id: string }[];
  // Marks biometric registration declined, so we do not prompt again
  biometricDeclined = !!localStorage.getItem(DECLINED_KEY);
  // Mutually exclusive biometric flows guard
  biometricBusy = false;
  // Platform authenticator present on this device (resolved asynchronously on init)
  biometricsAvailable = false;

  constructor() {
    this.title = this.api.config.site_name;
    this.auths = this.api.config.authenticators.slice(0);
    // Sort array, so we can display it correctly
    this.auths.sort((a, b) => a.priority - b.priority);
    this.biometricHints = this.biometric.getHints();
  }

  async ngOnInit(): Promise<void> {
    // We want to keep compatibility right now with previous UDS templates, so we
    // adapt form to post the correct values the correct way
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
      // The last login attempt (biometric or hint-assisted) failed. There is no
      // valid credential stored server side anymore (it is invalidated there too),
      // so clean up the local hints and show the error.
      this.biometric.clearAllHints();
      localStorage.removeItem(AUTO_PAUSED_KEY);
      this.biometricHints = [];
      this.api.gui.alert(django.gettext('Errors found'), '<div>' + this.api.errors.join('</div><div>') + '</div>');
    }

    if (this.api.config.allow_biometric_auth) {
      this.biometricsAvailable = await this.biometric.isSupported();
    }
    if (this.api.errors.length === 0 && this.shouldAutoLaunchBiometrics()) {
      this.doBiometricLogin(this.biometricHints[0].username, this.biometricHints[0].auth_id);
    }
  }

  canUseBiometrics(): boolean {
    return this.api.config.allow_biometric_auth && this.biometricsAvailable && this.biometricHints.length > 0;
  }

  private shouldAutoLaunchBiometrics(): boolean {
    return this.canUseBiometrics() && this.biometricHints.length === 1 && !localStorage.getItem(AUTO_PAUSED_KEY);
  }

  /**
   * Biometric login: unlocks the server side vault (fingerprint verified by
   * UDS), fills the login form with the decrypted password and submits it.
   * If UDS provided a fresh PRF salt (rotation), it is attached to the POST
   * so the server can rotate the vault as the login succeeds.
   */
  async doBiometricLogin(username: string, authId: string): Promise<void> {
    if (this.biometricBusy) {
      return;
    }
    this.biometricBusy = true;
    try {
      const unlocked = await this.biometric.unlockVault(username, authId);
      if (!unlocked) {
        return; // No vault available, hint removed by the service
      }
      this.setWebauthnPayload({
        rotated_vault: unlocked.rotated_vault,
        credential_id: unlocked.credential_id,
      });
      this.fillForm(unlocked.username, unlocked.password, unlocked.auth_id);
      this.biometric.addHint({
        username: unlocked.username,
        auth_id: unlocked.auth_id,
        credential_id: unlocked.credential_id,
      });
      localStorage.removeItem(AUTO_PAUSED_KEY);
      this.launchSubmit();
    } catch (err) {
      // User cancelled, expired challenge, stale credentials... stay on login
      console.error('Biometric login failed:', err);
      if (isTransientWebAuthnError(err)) {
        // Dropping the hint here would make the next password login register
        // a second credential for this same browser.
        localStorage.setItem(AUTO_PAUSED_KEY, 'true');
        this.api.gui.alert(
          django.gettext('Biometric Login'),
          django.gettext(
            'The biometric login was cancelled or could not be completed. Use the biometric login button to try again.',
          ),
        );
      } else {
        this.biometric.removeHint(username, authId);
        this.biometricHints = this.biometric.getHints().map((h) => ({ username: h.username, auth_id: h.auth_id }));
        this.api.gui.alert(django.gettext('Error'), django.gettext('Biometric login failed'));
      }
    } finally {
      this.biometricBusy = false;
    }
  }

  /**
   * Fills the login form fields. Used by the biometric flow just before the
   * form submit, the same way as if the user had typed everything manually.
   */
  private fillForm(username: string, password: string, authId: string): void {
    const userField = document.getElementById('id_user') as HTMLInputElement;
    const passField = document.getElementById('id_password') as HTMLInputElement;
    const authField = document.getElementById('authenticator') as HTMLInputElement;
    if (userField && passField) {
      userField.value = username;
      passField.value = password;
      if (authField && authId) {
        // Only select known authenticators on the form (id is the
        // authenticator uuid, as served in the login page config)
        if (this.auths.some((a) => String(a.id) === String(authId))) {
          authField.value = String(authId);
        }
      }
    }
  }

  /**
   * Attaches the biometric payload (rotation data) to the login POST.
   */
  private setWebauthnPayload(payload: { rotated_vault: string; credential_id: string } | null): void {
    const field = document.getElementById('webauthn') as HTMLInputElement;
    if (field) {
      field.value = payload ? JSON.stringify(payload) : '';
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
          document.getElementsByClassName('login-form')[0].setAttribute('style', 'display: none;');
          this.api.getAuthCustomJavascript(l.id).then((result) => doCustomAuth(result));
        }
      }
    }
  }

  async launch(arg1?: Event | boolean): Promise<void> {
    if (arg1 instanceof Event) {
      arg1.preventDefault();
    }

    const form = document.getElementById('loginform') as HTMLFormElement;
    const user = (document.getElementById('id_user') as HTMLInputElement).value;
    const pass = (document.getElementById('id_password') as HTMLInputElement).value;
    const auth = (document.getElementById('authenticator') as HTMLInputElement).value;

    // Registration of the biometric vault happens BEFORE the form submit,
    // because the password is only available in plaintext right now. The
    // uploads are attached to this very login POST (pending server state), so
    // if the login fails, no biometric data is stored at all.
    // One biometric credential per browser: never offered while a hint exists.
    if (this.api.config.allow_biometric_auth && !this.biometricDeclined && this.biometricHints.length === 0) {
      const supported = await this.biometric.isSupported();
      if (user && pass && supported) {
        const save = await this.api.gui.yesno(
          django.gettext('Biometric Login'),
          django.gettext('Would you like to save your credentials for future biometric login?'),
        );
        if (save) {
          try {
            const credentialId = await this.biometric.registerVault(user, pass, auth);
            this.biometric.addHint({ username: user, auth_id: auth, credential_id: credentialId });
            localStorage.removeItem(AUTO_PAUSED_KEY);
            this.biometricHints = this.biometric.getHints().map((h) => ({ username: h.username, auth_id: h.auth_id }));
          } catch (err) {
            // Cancelled or unsupported; login continues normally
            console.error('Biometric registration error:', err);
            this.api.gui.alert(django.gettext('Error'), django.gettext('Could not register biometrics'));
          }
        } else {
          this.biometricDeclined = true;
          localStorage.setItem(DECLINED_KEY, 'true');
        }
      }
    }

    // Registration finished (or skipped): clean up the payload field so a
    // plain manual login does not carry stale biometric data.
    this.setWebauthnPayload(null);
    form.action = this.api.config.urls.login;
    form.method = 'POST';
    form.submit();
  }

  /** Submits the login form directly (used by the biometric unlock flow). */
  private launchSubmit(): void {
    const form = document.getElementById('loginform') as HTMLFormElement;
    form.action = this.api.config.urls.login;
    form.method = 'POST';
    form.submit();
  }
}
