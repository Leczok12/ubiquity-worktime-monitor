export type UbiquitiAccessSystemLog = {
    hits: {
        '@timestamp': string;
        _id: string;
        _source: {
            actor: {
                alternate_id: string;
                alternate_name: string;
                display_name: string;
                id: string;
                type: string;
            };
            authentication: {
                credential_provider: string;
                issuer: string;
            };
            event: {
                display_message: string;
                log_category: string;
                log_key: string;
                published: number;
                reason: string;
                resoult: 'BLOCKED' | 'ACCESS';
                type: string;
            };
            target: {
                alternate_id: string;
                alternate_name: string;
                display_name: string;
                id: string;
                type: string;
            }[];
        };
        tag: string;
    }[];
};
