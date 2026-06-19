export interface ApiGetGroup {
    id: string;
    name: string;
    sync?: boolean;
}

export interface ApiCreateGroup {
    id?: string;
    name: string;
    sync?: boolean;
}

export interface ApiUpdateGroup {
    name: string;
    sync?: boolean;
}
