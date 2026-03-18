export interface ApiWorkerResponse {
    id: string;
    name: string;
    lastname: string;
    email: string | null;
    active: boolean;
    sync?: boolean;
    favorite?: boolean;
}
