export class UbiquitiAccessError extends Error {
    constructor(
        public code: string,
        public msg: string
    ) {
        super(msg);
        this.name = 'UbiquitiAccessError';
    }
}

export const isUbiquitiAccessError = (error: unknown): error is UbiquitiAccessError => {
    if (typeof error !== 'object' || error === null) {
        return false;
    }
    const candidate = error as Record<string, unknown>;
    return typeof candidate.code === 'string' && typeof candidate.msg === 'string';
};
