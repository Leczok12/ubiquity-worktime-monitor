import nodeCron, { ScheduledTask } from 'node-cron';
import { logger } from '../logger';

export class CronJob {
    private scheduledTask: ScheduledTask | null = null;
    private name: string = '';
    private cronExpression: string = '';
    private running: boolean = false;
    private task: () => Promise<void> = async () => {};

    public constructor(name: string, cronExpression: string, task: () => Promise<void>) {
        this.name = name;
        this.cronExpression = cronExpression;
        this.task = task;

        logger.info(`Initializing cron job "${this.name}" with expression "${this.cronExpression}"`);

        this.scheduledTask = nodeCron.schedule(this.cronExpression, async () => {
            if (this.running) {
                logger.warn(`Previous cron job "${this.name}" is still running. Skipping this run.`);
                return;
            }

            logger.info(`Starting cron job "${this.name}"`);

            this.running = true;
            try {
                await this.task();
            } finally {
                this.running = false;
            }
        });
    }

    public isRunning(): boolean {
        return this.running;
    }
}
