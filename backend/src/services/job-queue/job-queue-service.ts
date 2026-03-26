import { Job, JobOptions } from './job-queue-types';

class JobQueueService {
    private queue: Job[] = [];
    private isProcessing = false;

    public push(job: () => Promise<void>, options?: JobOptions): void {
        this.queue.push({ job, ...options });
        this.processAllJobs();
    }

    public async processAllJobs(): Promise<void> {
        if (this.isProcessing) return;
        this.isProcessing = true;
        try {
            await this._processAllJobs();
        } finally {
            this.isProcessing = false;
        }
    }

    private async _processAllJobs(): Promise<void> {
        while (this.queue.length > 0) {
            await this._processJob();
        }
    }

    private async _processJob(): Promise<void> {
        const job = this.queue.shift();
        if (!job) return;
        try {
            await job.job();
            job.onSuccess?.();
        } catch (error) {
            job.onError?.(error as Error);
        }
    }
}

const jobQueue = new JobQueueService();

export { jobQueue };
