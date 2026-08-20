import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { UDSApiService } from '../../services/uds-api.service';
import { BiometricService } from '../../services/biometric.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SafeHtmlPipe } from '../../helpers/safe-html.pipe';

/**
 * Verifies that the login component reads the CSRF token issued by the server
 * (``csrf.csrfToken`` global + ``csrftoken`` cookie) and bakes it into the
 * ``token`` hidden input as ``csrfField=<csrfToken>``. This is the contract
 * Django's ``CsrfViewMiddleware`` expects on POST; if the field name or value
 * is wrong the server returns 403 Forbidden.
 */
describe('LoginComponent CSRF handling', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let apiStub: jasmine.SpyObj<UDSApiService>;

  beforeEach(async () => {
    apiStub = jasmine.createSpyObj<UDSApiService>(
      'UDSApiService',
      ['csrfField', 'csrfToken', 'staticURL'],
      {
        config: {
          site_name: 'UDS',
          site_information: '',
          authenticators: [],
          allow_biometric_auth: false,
          urls: { login: '/uds/page/login' },
        } as any,
        errors: [],
      },
    );
    // Default stub: csrfField/csrfToken get() return these values.
    (apiStub as any).csrfField = 'csrfmiddlewaretoken';
    (apiStub as any).csrfToken = 'test-csrf-token-1234';
    // staticURL is referenced by the login template for the brand image.
    (apiStub as any).staticURL = (path: string) => `/uds/res/${path}`;

    await TestBed.configureTestingModule({
      declarations: [LoginComponent, SafeHtmlPipe],
      providers: [
        { provide: UDSApiService, useValue: apiStub },
        {
          provide: BiometricService,
          useValue: jasmine.createSpyObj('BiometricService', ['hasStoredData', 'clearCredentials']),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
  });

  function setCsrfCookie(value: string | null): void {
    if (value === null) {
      // Erase the cookie by setting it expired in the past.
      document.cookie = 'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    } else {
      document.cookie = `csrftoken=${value}; path=/`;
    }
  }

  function tokenInput(): HTMLInputElement | null {
    return document.getElementById('token') as HTMLInputElement | null;
  }

  function requireInput(): HTMLInputElement {
    const el = tokenInput();
    if (el === null) {
      fail('Expected #token hidden input to be present in the DOM');
    }
    return el as HTMLInputElement;
  }

  afterEach(() => {
    setCsrfCookie(null);
  });

  it('reads the csrfField from the UDSApiService and sets it as the hidden input name', () => {
    setCsrfCookie('cookie-value-must-not-be-used-as-form-value');
    fixture.detectChanges();
    const input = requireInput();
    // ngOnInit sets input.name to api.csrfField ("csrfmiddlewaretoken").
    expect(input.name).toBe('csrfmiddlewaretoken');
  });

  it('reads the csrfToken from the csrftoken cookie and sets it as the hidden input value', () => {
    // Set a known cookie value before the component initialises.
    setCsrfCookie('cookie-csrf-token-xyz');
    fixture.detectChanges();
    const input = requireInput();
    // Critical: the form input value MUST come from the cookie, not from
    // UDSApiService.csrfToken (the global is convenience, the cookie is
    // authoritative for the browser, both must be present).
    expect(input.value).toBe('cookie-csrf-token-xyz');
  });

  it('sets the value to empty string when no csrftoken cookie is present', () => {
    setCsrfCookie(null);
    fixture.detectChanges();
    const input = requireInput();
    // Browser-equivalent behaviour: split('=')[1] on an empty split returns ''.
    expect(input.value).toBe('');
  });

  it('uses the configured CSRF_FIELD name (not the framework default X-CSRFToken)', () => {
    // If a future Django version changed the cookie name, the apiStub would
    // expose the new name here; the component must propagate it.
    (apiStub as any).csrfField = 'custom-csrf-name';
    setCsrfCookie('any-value');
    fixture.detectChanges();
    const input = requireInput();
    expect(input.name).toBe('custom-csrf-name');
  });
});