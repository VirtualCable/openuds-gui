import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BiometricService } from './biometric.service';
import { UDSApiService } from './uds-api.service';

describe('BiometricService unlock', () => {
  const START_URL = '/uds/webauthn/biometric/start';
  const HINTS_KEY = 'uds_biometric_hints';

  let service: BiometricService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.removeItem(HINTS_KEY);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BiometricService,
        { provide: UDSApiService, useValue: { config: { urls: { webauthn: { biometric_start: START_URL } } } } },
      ],
    });
    service = TestBed.inject(BiometricService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem(HINTS_KEY);
  });

  async function startRequestBody(username: string, authId: string): Promise<unknown> {
    const unlocked = service.unlockVault(username, authId);
    const request = httpMock.expectOne(START_URL);
    request.flush({ available: false });
    await unlocked;
    return request.request.body;
  }

  it('asks for the credential registered on this browser', async () => {
    service.addHint({ username: 'alice', auth_id: 'auth-1', credential_id: 'cred-of-this-browser' });

    const body = await startRequestBody('alice', 'auth-1');

    expect(body).toEqual({ username: 'alice', auth_id: 'auth-1', credential_id: 'cred-of-this-browser' });
  });

  it('does not borrow the credential of another user hint', async () => {
    service.addHint({ username: 'bob', auth_id: 'auth-1', credential_id: 'cred-of-bob' });

    const body = (await startRequestBody('alice', 'auth-1')) as { credential_id?: string };

    expect(body.credential_id).toBeUndefined();
  });
});
