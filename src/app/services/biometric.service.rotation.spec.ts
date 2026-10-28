import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BiometricService } from './biometric.service';
import { UDSApiService } from './uds-api.service';

/**
 * The server switches to the new PRF salt whenever the login POST carries a
 * rotated vault. If the client cannot rotate (the authenticator returned no
 * second PRF output) and sends back the current blob, the server pairs the old
 * ciphertext with the new salt and the next unlock can no longer decrypt it.
 */
describe('BiometricService vault rotation', () => {
  const START_URL = '/uds/webapi/webauthn/biometric-start';
  const FINISH_URL = '/uds/webapi/webauthn/biometric-finish';
  const PASSWORD = 'secret-password';

  let service: BiometricService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BiometricService,
        {
          provide: UDSApiService,
          useValue: { config: { urls: { webauthn: { biometric_start: START_URL, biometric_finish: FINISH_URL } } } },
        },
      ],
    });
    service = TestBed.inject(BiometricService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function prfOutput(seed: number): ArrayBuffer {
    return new Uint8Array(32).fill(seed).buffer;
  }

  async function vaultFor(prf: ArrayBuffer): Promise<string> {
    const internals = service as any;
    const key = await internals.deriveKey(prf);
    return internals.encrypt(key, JSON.stringify({ password: PASSWORD, v: 1 }));
  }

  function fakeAssertion(first: ArrayBuffer, second?: ArrayBuffer): PublicKeyCredential {
    const empty = new ArrayBuffer(1);
    return {
      response: { clientDataJSON: empty, authenticatorData: empty, signature: empty },
      getClientExtensionResults: () => ({ prf: { results: second ? { first, second } : { first } } }),
    } as unknown as PublicKeyCredential;
  }

  async function unlock(assertion: PublicKeyCredential, blob: string, nextSalt: string | null = 'bmV4dA') {
    spyOn(navigator.credentials, 'get').and.resolveTo(assertion);
    const unlocked = service.unlockVault('alice', 'auth-1');

    httpMock.expectOne(START_URL).flush({
      available: true,
      challenge: 'Y2hhbGxlbmdl',
      credential_id: 'Y3JlZA',
      salt: 'c2FsdA',
      next_salt: nextSalt ?? undefined,
    });
    await new Promise((resolve) => setTimeout(resolve));
    httpMock.expectOne(FINISH_URL).flush({ ok: true, username: 'alice', auth_id: 'auth-1', blob });

    return unlocked;
  }

  it('sends no rotated vault when the authenticator returns a single PRF output', async () => {
    const first = prfOutput(1);
    const blob = await vaultFor(first);

    const result = await unlock(fakeAssertion(first), blob);

    expect(result?.password).toBe(PASSWORD);
    expect(result?.rotated_vault).toBe('');
  });

  it('sends no rotated vault when the server gives no next salt', async () => {
    const first = prfOutput(1);
    const blob = await vaultFor(first);

    const result = await unlock(fakeAssertion(first, prfOutput(2)), blob, null);

    expect(result?.password).toBe(PASSWORD);
    expect(result?.rotated_vault).toBe('');
  });

  it('sends no rotated vault when re-encryption fails', async () => {
    const first = prfOutput(1);
    const blob = await vaultFor(first);
    spyOn(service as any, 'encrypt').and.rejectWith(new Error('encryption failed'));

    const result = await unlock(fakeAssertion(first, prfOutput(2)), blob);

    expect(result?.password).toBe(PASSWORD);
    expect(result?.rotated_vault).toBe('');
  });

  it('re-encrypts the vault with the second PRF output when it is available', async () => {
    const first = prfOutput(1);
    const second = prfOutput(2);
    const blob = await vaultFor(first);

    const result = await unlock(fakeAssertion(first, second), blob);

    expect(result?.rotated_vault).not.toBe('');
    expect(result?.rotated_vault).not.toBe(blob);
    const internals = service as any;
    const decrypted = JSON.parse(await internals.decrypt(await internals.deriveKey(second), result!.rotated_vault));
    expect(decrypted.password).toBe(PASSWORD);
  });
});
