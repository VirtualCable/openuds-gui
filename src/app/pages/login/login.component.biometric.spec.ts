import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LoginComponent } from './login.component';
import { UDSApiService } from '../../services/uds-api.service';
import { BiometricService } from '../../services/biometric.service';
import { SafeHtmlPipe } from '../../helpers/safe-html.pipe';

describe('LoginComponent biometric unlock failures', () => {
  const AUTO_PAUSED_KEY = 'uds_biometric_auto_paused';
  const HINT = { username: 'alice', auth_id: 'auth-1', credential_id: 'cred-1' };

  let api: {
    config: any;
    errors: string[];
    csrfField: string;
    gui: jasmine.SpyObj<any>;
    staticURL: (p: string) => string;
  };
  let biometric: jasmine.SpyObj<BiometricService>;

  beforeEach(async () => {
    (window as any).django = { gettext: (text: string) => text };
    localStorage.removeItem(AUTO_PAUSED_KEY);

    api = {
      config: {
        site_name: 'UDS',
        site_information: '',
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
      'isSupported',
      'registerVault',
    ]);
    biometric.getHints.and.returnValue([HINT]);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent, SafeHtmlPipe],
      providers: [
        { provide: UDSApiService, useValue: api },
        { provide: BiometricService, useValue: biometric },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  afterEach(() => localStorage.removeItem(AUTO_PAUSED_KEY));

  function createLogin(): LoginComponent {
    const fixture = TestBed.createComponent(LoginComponent);
    return fixture.componentInstance;
  }

  function stubLoginForm(): jasmine.SpyObj<HTMLFormElement> {
    const form = jasmine.createSpyObj<HTMLFormElement>('HTMLFormElement', ['submit']);
    const getElementById = document.getElementById.bind(document);
    spyOn(document, 'getElementById').and.callFake((id: string) => (id === 'loginform' ? form : getElementById(id)));
    return form;
  }

  it('keeps the hint and pauses the automatic prompt when the user cancels it', async () => {
    biometric.unlockVault.and.rejectWith(new DOMException('cancelled', 'NotAllowedError'));
    const login = createLogin();

    await login.doBiometricLogin(HINT.username, HINT.auth_id);

    expect(biometric.removeHint).not.toHaveBeenCalled();
    expect(localStorage.getItem(AUTO_PAUSED_KEY)).toBe('true');
    expect(api.gui.alert).toHaveBeenCalled();
  });

  it('keeps the hint on an aborted prompt', async () => {
    biometric.unlockVault.and.rejectWith(new DOMException('aborted', 'AbortError'));
    const login = createLogin();

    await login.doBiometricLogin(HINT.username, HINT.auth_id);

    expect(biometric.removeHint).not.toHaveBeenCalled();
  });

  it('drops the hint when the server rejects the biometric verification', async () => {
    biometric.unlockVault.and.rejectWith(new Error('Biometric verification failed'));
    const login = createLogin();

    await login.doBiometricLogin(HINT.username, HINT.auth_id);

    expect(biometric.removeHint).toHaveBeenCalledOnceWith(HINT.username, HINT.auth_id);
    expect(localStorage.getItem(AUTO_PAUSED_KEY)).toBeNull();
    expect(api.gui.alert).toHaveBeenCalled();
  });

  it('resumes the automatic prompt after a biometric login from the manual button', async () => {
    localStorage.setItem(AUTO_PAUSED_KEY, 'true');
    biometric.unlockVault.and.resolveTo({
      username: HINT.username,
      password: 'secret',
      auth_id: HINT.auth_id,
      credential_id: HINT.credential_id,
      rotated_vault: 'vault',
    });
    const fixture = TestBed.createComponent(LoginComponent);
    // Load the page while paused, or a deferred ngOnInit would auto launch after the test
    fixture.detectChanges();
    const login = fixture.componentInstance;
    const form = stubLoginForm();

    await login.doBiometricLogin(HINT.username, HINT.auth_id);

    expect(form.submit).toHaveBeenCalled();
    expect(localStorage.getItem(AUTO_PAUSED_KEY)).toBeNull();
  });

  it('resumes the automatic prompt once a new credential is registered', async () => {
    localStorage.setItem(AUTO_PAUSED_KEY, 'true');
    biometric.getHints.and.returnValue([]);
    biometric.isSupported.and.resolveTo(true);
    biometric.registerVault.and.resolveTo('cred-2');
    api.gui.yesno.and.resolveTo(true);
    const login = createLogin();
    (document.getElementById('id_user') as HTMLInputElement).value = 'bob';
    (document.getElementById('id_password') as HTMLInputElement).value = 'secret';
    const form = stubLoginForm();

    await login.launch();

    expect(form.submit).toHaveBeenCalled();
    expect(biometric.addHint).toHaveBeenCalled();
    expect(localStorage.getItem(AUTO_PAUSED_KEY)).toBeNull();
  });

  it('does not relaunch the automatic prompt after a cancellation', () => {
    localStorage.setItem(AUTO_PAUSED_KEY, 'true');
    const login = createLogin();
    spyOn(login, 'doBiometricLogin');

    login.ngOnInit();

    expect(login.doBiometricLogin).not.toHaveBeenCalled();
    expect(login.canUseBiometrics()).toBeTrue();
  });

  it('launches the automatic prompt when it was not paused', () => {
    const login = createLogin();
    spyOn(login, 'doBiometricLogin');

    login.ngOnInit();

    expect(login.doBiometricLogin).toHaveBeenCalledOnceWith(HINT.username, HINT.auth_id);
  });

  it('clears the pause when the login page comes back with errors', () => {
    localStorage.setItem(AUTO_PAUSED_KEY, 'true');
    api.errors = ['Invalid credentials'];
    const login = createLogin();

    login.ngOnInit();

    expect(biometric.clearAllHints).toHaveBeenCalled();
    expect(localStorage.getItem(AUTO_PAUSED_KEY)).toBeNull();
  });
});
