class JobQueueService {
    private queue: (() => Promise<void>)[] = [];
    private intervalId: NodeJS.Timeout | null = null;
    private isProcessing = false;

    constructor() {
        this.intervalId = setInterval(() => {
            if (this.isProcessing) return;
            this.isProcessing = true;
            this.process().finally(() => {
                this.isProcessing = false;
            });
        }, 1000 * 10);
    }

    public async push(job: () => Promise<void>): Promise<void> {
        this.queue.push(job);
    }

    public async process(): Promise<void> {
        while (this.queue.length > 0) {
            const job = this.queue.shift();

            if (!job) return;
            await job();
        }
    }
}

const jobQueue = new JobQueueService();

export { jobQueue };
