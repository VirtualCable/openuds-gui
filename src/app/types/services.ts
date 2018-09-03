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
}

export interface JSONService {
    allow_users_remove: boolean;
    allow_users_reset: boolean;
    comments: string;
    description: string;
    group: JSONGroup;
    id: string;
    imageId: string;
    is_use: boolean;
    maintenance: boolean;
    name: string;
    not_accesible: boolean;
    show_transports: boolean;
    to_be_replaced: boolean;
    to_be_replaced_text: string;
    transports: JSONTransport[];
    visual_name: string;
}

export interface JSONServicesInformation {
    autorun: boolean;
    ip: string;
    nets: string;
    services: JSONService[];
    transports: string;
}

export interface JSONEnabledService {
    url: string;
    error: string;
}
