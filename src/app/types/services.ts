// Types definition for services json

export interface JSONGroup {
    id: string;
    name: string;
    comments: string;
    imageUuid: string;
    priority: number;
}

export interface JSONTransport {
    id: string;
    link: string;
    name: string;
    priority: number;
    favorite?: boolean;
}

export interface JSONService {
    id: string;
    is_meta: boolean;
    comments: string;
    description: string;
    group: JSONGroup;
    imageId: string;
    maintenance: boolean;
    name: string;
    visual_name: string;
    not_accesible: boolean;
    show_transports: boolean;
    allow_users_remove: boolean;
    allow_users_reset: boolean;
    to_be_replaced: boolean;
    to_be_replaced_text: string;
    custom_calendar_text: string;
    custom_message_text: string|null;
    in_use: boolean;
    transports: JSONTransport[];
    favorite: boolean;
}

export interface JSONServicesInformation {
    autorun: boolean;
    services: JSONService[];
}

export interface JSONErrorInformation {
    error: string;
    code: string;
}

export interface JSONEnabledService {
    url: string;
    error: string;
    /* true when the error means the service is still being created, poll again */
    retryable?: boolean;
    percent?: number;
}

export interface JSONStatusService {
    status: string;
    /* 0-100 progress while the service is being prepared */
    percent?: number;
    /* user-facing stage message, blackbox from uds */
    message?: string;
}

export interface JSONTransportURLService {
    url?: string;
    /** percent (0-100) while the service is being prepared, undefined when ready */
    running?: number;
    error?: string;
    /* user-facing stage message */
    message?: string;
}
