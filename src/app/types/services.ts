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
    id: string;
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
    in_use: boolean;
    transports: JSONTransport[];
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
