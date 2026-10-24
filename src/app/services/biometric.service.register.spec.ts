import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BiometricService } from './biometric.service';
import { UDSApiService } from './uds-api.service';

describe('BiometricService registration device id', () => {
  const SAVE_START_URL = '/uds/webapi/webauthn/save-start';
  const DEVICE_ID_KEY = 'uds_biometric_device_id';

  const DEVICE_ID_FORMAT = /^[A-Za-z0-9_-]{43}$/;

  let service: BiometricService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.removeItem(DEVICE_ID_KEY);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BiometricService,
        { provide: UDSApiService, useValue: { config: { urls: { webauthn: { save_start: SAVE_START_URL } } } } },
      ],
    });
    service = TestBed.inject(BiometricService);
    httpMock = TestBed.inject(HttpTestingController);
    spyOn(navigator.credentials, 'create').and.rejectWith(new DOMException('cancelled', 'NotAllowedError'));
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem(DEVICE_ID_KEY);
  });

  async function saveStartBody(): Promise<{ device_id?: string }> {
    const registering = service.registerVault('alice', 'secret', 'auth-1');
    const request = httpMock.expectOne(SAVE_START_URL);
    request.flush({
      challenge: 'Y2hhbGxlbmdl',
      user: { name: 'alice', display_name: 'Alice', handle: 'aGFuZGxl' },
      salts: { active: 'YWN0aXZl', next: 'bmV4dA' },
    });
    await expectAsync(registering).toBeRejected();
    return request.request.body;
  }

  it('sends a random device id when registering', async () => {
    const body = await saveStartBody();

    expect(body.device_id).toMatch(DEVICE_ID_FORMAT);
  });

  it('sends the same device id on every registration from this browser', async () => {
    const first = await saveStartBody();
    const second = await saveStartBody();

    expect(first.device_id).toMatch(DEVICE_ID_FORMAT);
    expect(second.device_id).toBe(first.device_id);
  });

  it('keeps the device id when the hints are cleared', async () => {
    const first = await saveStartBody();
    service.clearAllHints();
    const second = await saveStartBody();

    expect(first.device_id).toMatch(DEVICE_ID_FORMAT);
    expect(second.device_id).toBe(first.device_id);
  });
});
