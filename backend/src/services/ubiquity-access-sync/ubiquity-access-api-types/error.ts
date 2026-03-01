export class UbiquityAccessError extends Error {
    constructor(public code: string, public msg: string) {
        super(msg);
        this.name = 'UbiquityAccessError';
    }
}

export const isUbiquityAccessError = (error: unknown): error is UbiquityAccessError => {
    if (typeof error !== 'object' || error === null) {
        return false;
    }
    const candidate = error as Record<string, unknown>;
    return typeof candidate.code === 'string' && typeof candidate.msg === 'string';
};
