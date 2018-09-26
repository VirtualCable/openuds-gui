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
    readonly static: string;
    readonly changeLang: string;
    readonly login: string;
    readonly logout: string;
    readonly customAuth: string;
    readonly services: string;
    readonly admin: string;
    readonly enabler: string;
    readonly resetter: string;
    readonly releaser: string;
    readonly galleryImage: string;
    readonly transportIcon: string;
}

export interface UDSConfig {
    readonly version: string;
    readonly version_stamp: string;
    readonly language: string;
    readonly available_languages: Lang[];
    readonly authenticators: Authenticator[];
    readonly os: string;
    readonly csrf_field: string;
    readonly csrf: string;
    readonly urls: UDSUrls;
    readonly bypassPluginDetection: boolean;
}

export interface Downloadable {
    readonly url: string;
    readonly description: string;
    readonly name: string;
}

export interface UserProfile {
    readonly user: string;
    readonly role: string;
}

// User related
export class User {
    readonly user: string;
    readonly role: string;

    constructor(profile: UserProfile) {
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
