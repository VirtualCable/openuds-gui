import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BiometricService {
  private readonly STORAGE_KEY = 'uds_biometric_login';
  private readonly DB_NAME = 'uds_biometrics_db';
  private readonly STORE_NAME = 'keys';
  private readonly KEY_ALIAS = 'encryption_key';
  private readonly DECLINED_KEY = 'uds_biometric_declined';

  constructor() {}

  /**
   * Checks if the browser supports WebAuthn.
   */
  async isSupported(): Promise<boolean> {
    if (!window.PublicKeyCredential) {
      return false;
    }
    
    if (!PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
        return false;
    }

    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return !!available;
  }

  /**
   * Checks if biometric data is stored locally.
   */
  hasStoredData(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  /**
   * Clears stored biometric data.
   */
  clearCredentials(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Checks if the user has previously declined biometric registration.
   */
  isDeclined(): boolean {
    return !!localStorage.getItem(this.DECLINED_KEY);
  }

  /**
   * Marks biometric registration as declined to avoid prompting the user again.
   */
  setDeclined(): void {
    localStorage.setItem(this.DECLINED_KEY, 'true');
  }

  /**
   * Clears the declined status (e.g., if user successfully registers).
   */
  clearDeclined(): void {
    localStorage.removeItem(this.DECLINED_KEY);
  }

  /**
   * Registers a biometric credential and stores the user/pass/auth encrypted.
   * This uses a local non-exportable key stored in IndexedDB.
   */
  async registerBiometrics(user: string, pass: string, auth: string): Promise<void> {
    const challenge = window.crypto.getRandomValues(new Uint8Array(32));
    const userHandle = window.crypto.getRandomValues(new Uint8Array(16));

    const options: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: 'UDS',
        ...(window.location.hostname.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/) 
            ? {} 
            : { id: window.location.hostname })
      },
      user: {
        id: userHandle,
        name: user,
        displayName: user
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },
        { alg: -257, type: 'public-key' }
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'required',
        requireResidentKey: true
      }
    };

    let credential;
    try {
        credential = (await navigator.credentials.create({ publicKey: options })) as PublicKeyCredential;
    } catch (err) {
        console.error('Biometric registration failed:', err);
        throw err;
    }

    const key = await this.getEncryptionKey(true);
    const data = JSON.stringify({ user, pass, auth });
    const encrypted = await this.encrypt(data, key);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      credentialId: this.arrayBufferToBase64(credential.rawId),
      payload: encrypted
    }));
  }

  /**
   * Authenticates via biometrics and returns the decrypted user/pass/auth.
   */
  async authenticateAndDecrypt(): Promise<{ user: string; pass: string; auth: string } | null> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const { credentialId, payload } = JSON.parse(stored);
    const options: PublicKeyCredentialRequestOptions = {
      challenge: window.crypto.getRandomValues(new Uint8Array(32)),
      allowCredentials: [{
        id: this.base64ToArrayBuffer(credentialId),
        type: 'public-key'
      }],
      userVerification: 'required'
    };

    const credential = await navigator.credentials.get({ publicKey: options });
    if (!credential) {
      return null;
    }

    const key = await this.getEncryptionKey(false);
    if (!key) {
      throw new Error('Encryption key not found');
    }

    const decrypted = await this.decrypt(payload, key);
    return JSON.parse(decrypted);
  }

  /**
   * Retrieves or creates a non-exportable encryption key from IndexedDB.
   */
  private async getEncryptionKey(createIfMissing: boolean): Promise<CryptoKey> {
    const db = await this.openDB();
    let key = await this.getKeyFromStore(db);
    
    if (!key && createIfMissing) {
      key = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        false, 
        ['encrypt', 'decrypt']
      );
      await this.saveKeyToStore(db, key);
    }
    
    return key as CryptoKey;
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME);
        }
      };
      request.onsuccess = (event: any) => resolve(event.target.result);
      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
    });
  }

  private getKeyFromStore(db: IDBDatabase): Promise<CryptoKey | undefined> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.STORE_NAME, 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(this.KEY_ALIAS);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to read from IndexedDB'));
    });
  }

  private saveKeyToStore(db: IDBDatabase, key: CryptoKey): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(this.STORE_NAME, 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.put(key, this.KEY_ALIAS);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('Failed to save to IndexedDB'));
      } catch (err) {
        reject(err);
      }
    });
  }

  private async encrypt(data: string, key: CryptoKey): Promise<string> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(data);
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return this.arrayBufferToBase64(combined.buffer);
  }

  private async decrypt(encryptedBase64: string, key: CryptoKey): Promise<string> {
    const combined = this.base64ToArrayBuffer(encryptedBase64);
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
