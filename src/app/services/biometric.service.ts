/**
 * Biometric login service (WebAuthn + server side vault).
 *
 * The user password is never stored in the browser, nor sent to UDS except
 * through the normal login POST (exactly like a manual login does).
 *
 * How it works, in a few words:
 *
 * - On a successful manual login (and if the user accepts), the client
 *   registers a WebAuthn platform credential (fingerprint) that UDS stores
 *   (public key only), bound to the browser origin.
 * - The login password is encrypted client side with a key derived from the
 *   WebAuthn PRF extension output (obtained from the platform authenticator
 *   under user verification, e.g. the fingerprint). UDS only keeps this
 *   opaque, encrypted blob ("vault") and can NEVER decrypt it.
 * - On biometric login, UDS verifies the WebAuthn assertion server side
 *   (server issued challenge, anti replay) and only then delivers the vault
 *   blob, that the client decrypts with the same PRF derived key to fill the
 *   login form. Every successful unlock also rotates the PRF salt,
 *   re-encrypting the vault, so a leaked blob becomes inert on the next
 *   successful login.
 *
 * Only transient, non-secret data is kept in localStorage: username hints,
 * so the login page can offer the fingerprint login without typing it.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { UDSApiService } from './uds-api.service';

const HINTS_KEY = 'uds_biometric_hints';
// Random id of this browser, sent when registering so the server replaces the
// credential this browser registered before instead of adding another one.
// Kept apart from the hints on purpose: clearing the hints must not reset it.
const DEVICE_ID_KEY = 'uds_biometric_device_id';

interface BiometricHint {
    username: string;
    auth_id: string;
    credential_id: string;
}

interface SaveStartResponse {
    challenge: string;
    user: { name: string; display_name: string; handle: string };
    salts: { active: string; next: string };
}

interface BiometricStartResponse {
    available: boolean;
    challenge?: string;
    credential_id?: string;
    salt?: string;
    next_salt?: string;
}

interface BiometricFinishResponse {
    ok: boolean;
    username?: string;
    auth_id?: string;
    blob?: string;
    error?: string;
}

/**
 * PRF extension results, as returned by getClientExtensionResults().
 * (Not declared in every TS dom lib version, so it is typed here.)
 */
interface PrfExtensionResults {
    results?: {
        first?: ArrayBuffer;
        second?: ArrayBuffer;
    };
}

interface UnlockedVault {
    password: string;
    rotated_vault: string;
    credential_id: string;
    username: string;
    auth_id: string;
}

@Injectable({ providedIn: 'root' })
export class BiometricService {
    private readonly http = inject(HttpClient);
    private readonly api = inject(UDSApiService);

    constructor() {}

    /**
     * Checks if the browser supports the WebAuthn platform authenticator.
     */
    async isSupported(): Promise<boolean> {
        if (!window.PublicKeyCredential) {
            return false;
        }
        if (!PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
            return false;
        }
        return !!(await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
    }

    // ------------------------------------------------------------------
    // Local, non secret hints of users with a biometric vault registered
    // ------------------------------------------------------------------

    getHints(): BiometricHint[] {
        try {
            const stored = localStorage.getItem(HINTS_KEY) || '[]';
            const hints = JSON.parse(stored);
            return Array.isArray(hints) ? hints : [];
        } catch {
            return [];
        }
    }

    addHint(hint: BiometricHint): void {
        const hints = this.getHints().filter(
            (h) => !(h.username === hint.username && h.auth_id === hint.auth_id),
        );
        hints.push(hint);
        localStorage.setItem(HINTS_KEY, JSON.stringify(hints));
    }

    removeHint(username: string, authId: string): void {
        this.saveHints(this.getHints().filter((h) => !(h.username === username && h.auth_id === authId)));
    }

    hasHints(): boolean {
        return this.getHints().length > 0;
    }

    /** Removes all hints (used after login failures with biometric users). */
    clearAllHints(): void {
        this.saveHints([]);
    }

    private saveHints(hints: BiometricHint[]): void {
        localStorage.setItem(HINTS_KEY, JSON.stringify(hints));
    }

    private deviceId(): string {
        let id = localStorage.getItem(DEVICE_ID_KEY);
        if (!id) {
            id = this.bufferToB64url(this.randomBuffer(32).buffer);
            localStorage.setItem(DEVICE_ID_KEY, id);
        }
        return id;
    }

    // ------------------------------------------------------------------
    // Encoding helpers (base64url <-> ArrayBuffer)
    // ------------------------------------------------------------------

    private bufferToB64url(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    private b64urlToBuffer(data: string): Uint8Array<ArrayBuffer> {
        const padded = data.replace(/-/g, '+').replace(/_/g, '/');
        const binary = atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), '='));
        const bytes = new Uint8Array(new ArrayBuffer(binary.length));
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    private randomBuffer(length: number): Uint8Array<ArrayBuffer> {
        return window.crypto.getRandomValues(new Uint8Array(length));
    }

    // ------------------------------------------------------------------
    // Vault crypto: AES-GCM key derived (HKDF) from the PRF output
    // ------------------------------------------------------------------

    /**
     * Derives the AES-GCM key for the vault from a PRF output buffer.
     */
    private async deriveKey(prfOutput: ArrayBuffer): Promise<CryptoKey> {
        const material = await window.crypto.subtle.importKey('raw', prfOutput, { name: 'HKDF' }, false, [
            'deriveBits',
        ]);
        const bits = await window.crypto.subtle.deriveBits(
            {
                name: 'HKDF',
                hash: 'SHA-256',
                salt: new TextEncoder().encode('uds-webauthn-vault'),
                info: new TextEncoder().encode('uds-biometric-login-v1'),
            },
            material,
            256,
        );
        return window.crypto.subtle.importKey('raw', bits, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
    }

    /**
     * Encrypts to an opaque base64url blob: IV(12) || AES-GCM(data, key)
     */
    private async encrypt(key: CryptoKey, data: string): Promise<string> {
        const iv = this.randomBuffer(12);
        const encrypted = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            new TextEncoder().encode(data),
        );
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(encrypted), iv.length);
        return this.bufferToB64url(combined.buffer);
    }

    /** Decrypts a blob produced by {@link encrypt}. */
    private async decrypt(key: CryptoKey, blob: string): Promise<string> {
        const combined = this.b64urlToBuffer(blob);
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);
        const decrypted = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            data.buffer,
        );
        return new TextDecoder().decode(decrypted);
    }

    // ------------------------------------------------------------------
    // Registration (saving the unlock for later)
    // ------------------------------------------------------------------

    /**
     * Registers the biometric credential and uploads the encrypted vault.
     *
     * The uploads happen on session-pending server state, and are committed
     * only when the login form POST succeeds (never on a failed login).
     *
     * @returns the base64url credential id of the registered credential
     * @throws on user cancellation, unsupported PRF or server errors
     */
    async registerVault(username: string, password: string, authId: string): Promise<string> {
        const start = await firstValueFrom(
            this.http.post<SaveStartResponse>(this.api.config.urls.webauthn.save_start, {
                username,
                auth_id: authId,
                device_id: this.deviceId(),
            }),
        );

        const credential = await this.createCredential(username, start);
        const credentialId = this.bufferToB64url(credential.rawId);

        const results = await this.evaluatePrf(
            credential.rawId,
            start.salts.active,
            start.salts.next,
        );
        if (!results.results?.first) {
            throw new Error('PRF extension is not supported by this authenticator');
        }

        const key = await this.deriveKey(results.results.first);
        const vault = await this.encrypt(key, JSON.stringify({ password, v: 1 }));

        await firstValueFrom(
            this.http.post<{ ok: boolean }>(this.api.config.urls.webauthn.save_finish, {
                client_data: this.bufferToB64url(credential.response.clientDataJSON),
                attestation_object: this.bufferToB64url(
                    (credential.response as AuthenticatorAttestationResponse).attestationObject,
                ),
                vault,
            }),
        );

        return credentialId;
    }

    /** Creates the WebAuthn credential (fingerprint touch #1), PRF requested. */
    private async createCredential(username: string, start: SaveStartResponse): Promise<PublicKeyCredential> {
        const challenge = this.b64urlToBuffer(start.challenge);
        const userHandle = this.b64urlToBuffer(start.user.handle);

        // rp.id must be the site domain. IP literals are not valid rp.id
        // values per WebAuthn spec, so deployments accessed by IP cannot use
        // the biometric login.
        const hostname = window.location.hostname;
        const isIpLiteral = /^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname.includes(':');

        const options: PublicKeyCredentialCreationOptions = {
            challenge,
            rp: { name: 'UDS', ...(isIpLiteral ? {} : { id: hostname }) },
            user: { id: userHandle, name: start.user.name, displayName: start.user.display_name },
            pubKeyCredParams: [
                { alg: -7, type: 'public-key' },
                { alg: -257, type: 'public-key' },
            ],
            authenticatorSelection: {
                authenticatorAttachment: 'platform',
                userVerification: 'required',
                residentKey: 'preferred',
            },
            extensions: { prf: {} },
        };

        const credential = (await navigator.credentials.create({ publicKey: options })) as PublicKeyCredential;
        return credential;
    }

    /**
     * Evaluates the PRF extension (fingerprint touch #2, registration time).
     *
     * The first salt is the one used to encrypt the stored vault; the second
     * one is a fresh salt for future rotation of the vault.
     */
    private async evaluatePrf(
        credentialId: ArrayBuffer,
        salt1: string,
        salt2?: string,
    ): Promise<PrfExtensionResults> {
        // Local only challenge: this assertion is not verified by the server
        // (its signature is not used, just the PRF output it produces under
        // user verification).
        const credential = (await navigator.credentials.get({
            publicKey: {
                challenge: this.randomBuffer(32),
                allowCredentials: [{ id: new Uint8Array(credentialId), type: 'public-key' }],
                userVerification: 'required',
                rpId: window.location.hostname,
                extensions: {
                    prf: {
                        eval: {
                            first: this.b64urlToBuffer(salt1),
                            second: salt2 ? this.b64urlToBuffer(salt2) : undefined,
                        },
                    },
                },
            },
        })) as PublicKeyCredential;

        return assertionPrfResults(credential);
    }

    // ------------------------------------------------------------------
    // Biometric login (unlock and submit)
    // ------------------------------------------------------------------

    /**
     * Unlocks the stored vault for the given user.
     *
     * Asks UDS for the challenge, verifies the fingerprint, gets the
     * server-assertion-verified vault blob, decrypts it locally with the PRF
     * derived key and prepares the rotation of the vault so the
     * server-stored blob becomes inert after this login.
     *
     * @returns the password + rotation data to attach to the login POST, or
     *          null if there is no usable biometric vault for this user.
     * @throws on WebAuthn or verification errors
     */
    async unlockVault(username: string, authId: string): Promise<UnlockedVault | null> {
        // Without it, the server falls back to the latest credential of the
        // user, which may live on another device
        const hint = this.getHints().find((h) => h.username === username && h.auth_id === authId);
        const start = await firstValueFrom(
            this.http.post<BiometricStartResponse>(this.api.config.urls.webauthn.biometric_start, {
                username,
                auth_id: authId,
                credential_id: hint?.credential_id,
            }),
        );

        if (!start.available || !start.challenge || !start.credential_id || !start.salt) {
            this.removeHint(username, authId); // Hint is stale
            return null;
        }

        const assertion = (await navigator.credentials.get({
            publicKey: {
                challenge: this.b64urlToBuffer(start.challenge),
                allowCredentials: [{ id: this.b64urlToBuffer(start.credential_id), type: 'public-key' }],
                userVerification: 'required',
                rpId: window.location.hostname,
                extensions: {
                    prf: {
                        eval: {
                            first: this.b64urlToBuffer(start.salt),
                            second: start.next_salt ? this.b64urlToBuffer(start.next_salt) : undefined,
                        },
                    },
                },
            },
        })) as PublicKeyCredential;

        const prf = assertionPrfResults(assertion);
        if (!prf.results?.first) {
            throw new Error('PRF extension output is missing');
        }

        const response = assertion.response as AuthenticatorAssertionResponse;
        const finish = await firstValueFrom(
            this.http.post<BiometricFinishResponse>(this.api.config.urls.webauthn.biometric_finish, {
                credential_id: start.credential_id,
                client_data: this.bufferToB64url(response.clientDataJSON),
                auth_data: this.bufferToB64url(response.authenticatorData),
                signature: this.bufferToB64url(response.signature),
            }),
        );

        if (!finish.ok || !finish.blob) {
            throw new Error(finish.error || 'Biometric verification failed');
        }

        const serverUsername = finish.username || username;
        const serverAuthId = finish.auth_id || authId;

        // Re-encrypt the vault with the fresh salt, so the server stored one
        // is inert from now on (rotation is committed only if login succeeds)
        const rotatedVault = await this.rotateVault(finish.blob, prf.results, start.next_salt);

        const key = await this.deriveKey(prf.results.first);
        const payload = JSON.parse(await this.decrypt(key, finish.blob));
        const password = payload.password;
        if (typeof password !== 'string') {
            throw new Error('Malformed vault payload');
        }

        return {
            password,
            rotated_vault: rotatedVault,
            credential_id: start.credential_id,
            username: serverUsername,
            auth_id: serverAuthId,
        };
    }

    /** Re-encrypts the vault with the fresh PRF salt, if enough data. */
    private async rotateVault(
        currentBlob: string,
        results: NonNullable<PrfExtensionResults['results']>,
        nextSalt?: string,
    ): Promise<string> {
        if (!nextSalt || !results.second) {
            return currentBlob; // Rotation impossible here, vault stays valid
        }
        try {
            const key = await this.deriveKey(results.first!);
            const payload = await this.decrypt(key, currentBlob);
            const newKey = await this.deriveKey(results.second);
            return await this.encrypt(newKey, payload);
        } catch {
            return currentBlob; // Rotate failure does not block the login
        }
    }
}

/** Extracts the PRF extension results from a WebAuthn credential. */
function assertionPrfResults(credential: PublicKeyCredential): PrfExtensionResults {
    const extensions = credential.getClientExtensionResults() as { prf?: PrfExtensionResults };
    return extensions.prf || {};
}
