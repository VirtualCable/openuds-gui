import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LoginComponent } from './login.component';
import { UDSApiService } from '../../services/uds-api.service';
import { BiometricService } from '../../services/biometric.service';
import { SafeHtmlPipe } from '../../helpers/safe-html.pipe';

describe('LoginComponent biometric hints after a login error', () => {
  let api: { config: any; errors: string[]; csrfField: string; gui: jasmine.SpyObj<any>; staticURL: (p: string) => string };
  let biometric: jasmine.SpyObj<BiometricService>;

  beforeEach(async () => {
    (window as any).django = { gettext: (text: string) => text };
    sessionStorage.clear();

    api = {
      config: {
        site_name: 'UDS',
        authenticators: [],
        allow_biometric_auth: true,
        urls: { login: '/uds/page/login' },
      },
      errors: [],
      csrfField: 'csrfmiddlewaretoken',
      gui: jasmine.createSpyObj('UDSGuiService', ['alert', 'yesno']),
      staticURL: (path: string) => `/uds/res/${path}`,
    };
    biometric = jasmine.createSpyObj<BiometricService>('BiometricService', [
      'getHints',
      'addHint',
      'removeHint',
      'clearAllHints',
      'unlockVault',
    ]);
    biometric.getHints.and.returnValue([]);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent, SafeHtmlPipe],
      providers: [
        { provide: UDSApiService, useValue: api },
        { provide: BiometricService, useValue: biometric },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  afterEach(() => sessionStorage.clear());

  function loadLoginPage(errors: string[]): LoginComponent {
    api.errors = errors;
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  async function submitBiometricLogin(component: LoginComponent, username: string, authId: string): Promise<void> {
    biometric.unlockVault.and.resolveTo({
      username,
      auth_id: authId,
      password: 'synthetic',
      rotated_vault: 'vault',
      credential_id: 'cred',
    });
    spyOn(component as any, 'launchSubmit');
    await component.doBiometricLogin(username, authId);
  }

  it('keeps every hint when a manual login fails', () => {
    loadLoginPage(['Invalid credentials']);

    expect(biometric.clearAllHints).not.toHaveBeenCalled();
    expect(biometric.removeHint).not.toHaveBeenCalled();
  });

  it('drops only the hint of the biometric login that failed', async () => {
    await submitBiometricLogin(loadLoginPage([]), 'alice', 'auth-1');

    loadLoginPage(['Invalid credentials']);

    expect(biometric.removeHint).toHaveBeenCalledOnceWith('alice', 'auth-1');
    expect(biometric.clearAllHints).not.toHaveBeenCalled();
  });

  it('forgets the biometric attempt once the login page loads without errors', async () => {
    await submitBiometricLogin(loadLoginPage([]), 'alice', 'auth-1');
    loadLoginPage([]);

    loadLoginPage(['Invalid credentials']);

    expect(biometric.removeHint).not.toHaveBeenCalled();
  });
});
