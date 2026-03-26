export type JobOptions = {
    onSuccess?(): void;
    onError?(error: Error): void;
};

export type Job = { job: () => Promise<void> } & JobOptions;
