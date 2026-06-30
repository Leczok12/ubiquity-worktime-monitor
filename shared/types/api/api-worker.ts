export interface ApiGetWorker {
    id: string;
    name: string;
    lastname: string;
    email: string | null;
    active: boolean;
    show?: boolean;
}

export interface ApiCreateWorker {
    id?: string;
    name: string;
    lastname: string;
    email: string | null;
    active: boolean;
    show?: boolean;
}

export interface ApiUpdateWorker {
    name?: string;
    lastname?: string;
    email?: string | null;
    active?: boolean;
    show?: boolean;
}
