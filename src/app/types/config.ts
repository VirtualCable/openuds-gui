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

// URLs related, remember that only NEEDED elements are declared, but more elements are available
export interface UDSUrls {
    readonly static: string;
    readonly changeLang: string;
    readonly login: string;
    readonly logout: string;
    readonly customAuth: string;
    readonly services: string;
    readonly admin: string;
    readonly enabler: string;
    readonly action: string;
    readonly galleryImage: string;
    readonly transportIcon: string;

    readonly launch: string;
}

export interface UDSMessages {
    readonly calendarDenied: string;
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
    readonly reload_time: number;
    readonly messages: UDSMessages;
    readonly urls: UDSUrls;
}

export interface Downloadable {
    readonly url: string;
    readonly description: string;
    readonly name: string;
}

export interface UserProfile {
    readonly user: string;
    readonly role: string;     // Info only, API will check it anyway, but hides non usable items
    readonly admin: boolean;   // Info only, API will check it anyway, but hides non usable items
}

// User related
export class User {
    readonly user: string;
    readonly role: string;
    readonly admin: boolean;

    constructor(profile: UserProfile) {
        this.user = profile.user;
        this.role = profile.role;
        this.admin = profile.admin;
    }

    get isStaff(): boolean {
        return this.role === 'staff';
    }

    get isAdmin(): boolean {
        return this.isStaff && this.admin;
    }

    get isLogged(): boolean {
        return this.user != null;
    }
}
