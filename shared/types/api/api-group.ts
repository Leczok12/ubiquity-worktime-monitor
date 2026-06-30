export interface ApiGetGroup {
    id: string;
    name: string;
    show?: boolean;
}

export interface ApiCreateGroup {
    id?: string;
    name: string;
    show?: boolean;
}

export interface ApiUpdateGroup {
    name?: string;
    show?: boolean;
}
