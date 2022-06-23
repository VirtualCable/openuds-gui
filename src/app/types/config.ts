/* eslint-disable @typescript-eslint/naming-convention */
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
    readonly mfa: string;
    readonly logout: string;
    readonly customAuth: string;
    readonly services: string;
    readonly admin: string;
    readonly enabler: string;
    readonly status: string;
    readonly action: string;
    readonly galleryImage: string;
    readonly transportIcon: string;
    readonly clientDownload: string;
    readonly error: string;

    readonly launch: string;
}

export interface UDSMessages {
    readonly calendarDenied: string;
}

export interface MFAInfo {
    label: string;
    validity: number;
}

export interface UDSConfig {
    readonly version: string;
    readonly version_stamp: string;
    readonly language: string;
    readonly available_languages: Lang[];
    readonly authenticators: Authenticator[];
    readonly mfa: MFAInfo;
    readonly os: string;
    readonly reload_time: number;
    readonly site_name: string;
    readonly site_copyright_info: string;
    readonly site_copyright_link: string;
    readonly site_logo_name: string;
    readonly site_information: string;
    readonly site_filter_on_top: boolean;
    readonly launcher_wait_time: number;
    readonly messages: UDSMessages;
    readonly urls: UDSUrls;
    readonly min_for_filter: number;
}

export interface Downloadable {
    readonly url: string;
    readonly description: string;
    readonly name: string;
    readonly legacy?: boolean;
}

export interface UserProfile {
    readonly user: string;
    readonly role: string;     // Info only, API will check it anyway, but hides non usable items
    readonly admin: boolean;   // Info only, API will check it anyway, but hides non usable items
}

export interface Info {
    readonly networks: string[];
    readonly transports: string[];
    readonly ip: string;
    readonly ip_proxy: string;
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
        return this.role === 'staff' || this.role === 'admin';
    }

    get isAdmin(): boolean {
        return this.role === 'admin';
    }

    get isLogged(): boolean {
        return this.user != null;
    }

    get isRestricted(): boolean {
        return this.role === 'restricted';
    }
}
