// Types definition for configuration from js

export interface Lang {
    readonly id: string;
    readonly name: string;
}

export interface Authenticator {
    id: string;
    name: string;
    label: string;
    priority: number;
    is_custom: string;
}

// URLs related
export interface UDSUrls {
    readonly changeLang: string;
    readonly login: string;
    readonly logout: string;
    readonly customAuth: string;
    readonly services: string;
    readonly admin: string;
    readonly enabler: string;
}

export interface UDSConfig {
    version: string;
    version_stamp: string;
    language: string;
    available_languages: Lang[];
    authenticators: Authenticator[];
    os: string;
    csrf_field: string;
    csrf: string;
    urls: UDSUrls;
    bypassPluginDetection: boolean;
}

export interface Downloadable {
    readonly url: string;
    readonly description: string;
    readonly name: string;
}

export interface Profile {
    readonly user: string;
    readonly role: string;
}

// User related
export class User {
    readonly user: string;
    readonly role: string;

    constructor(profile: Profile) {
        this.user = profile.user;
        this.role = profile.role;
    }

    get isStaff(): boolean {
        return this.role === 'staff';
    }

    get isLogged(): boolean {
        return this.user != null;
    }
}
