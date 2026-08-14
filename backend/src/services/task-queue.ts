import { logger } from '@shared/utils/logger';
import cron, { ScheduledTask } from 'node-cron';

class TaskQueue {
    private cronTasks: {
        name: string;
        cronExpression: string;
        task: ScheduledTask;
    }[] = [];

    private tasks: {
        name: string;
        task: () => Promise<void>;
    }[] = [];

    private isDoingTasks: boolean = false;

    private async doAllTasks(): Promise<void> {
        if (this.isDoingTasks) {
            return;
        }
        this.isDoingTasks = true;
        while (this.tasks.length > 0) {
            const { name, task } = this.tasks.shift()!;
            try {
                logger.info(`Executing task "${name}"`);
                await task();
            } catch (error) {
                if (error instanceof Error) {
                    logger.error(`Error executing task ${name}: ${error.message}`);
                } else {
                    logger.error(`Error executing task ${name}: ${error}`);
                }
            }
        }
        this.isDoingTasks = false;
    }

    public createTask(name: string, cronExpression: string, job: () => Promise<void>): void {
        const existingTask = this.cronTasks.find((task) => task.name === name);
        if (existingTask) {
            existingTask.task.stop();
            this.cronTasks = this.cronTasks.filter((task) => task.name !== name);
        }
        const newTask = cron.schedule(cronExpression, async () => {
            this.tasks.push({ name, task: job });
            await this.doAllTasks();
        });
        this.cronTasks.push({ name, cronExpression, task: newTask });
    }

    public createImmediateTask(name: string, job: () => Promise<void>): void {
        this.tasks.push({ name, task: job });
        this.doAllTasks();
    }

    public deleteTask(name: string): void {
        const index = this.cronTasks.findIndex((task) => task.name === name);
        if (index !== -1) {
            this.cronTasks[index].task.stop();
            this.cronTasks.splice(index, 1);
        }
    }
}

const taskQueue = new TaskQueue();

export { taskQueue };
