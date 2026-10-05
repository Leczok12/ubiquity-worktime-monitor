import { loadEnvVariable } from '../load-env-variable';
import { LogType } from './logger-types';

class LoggerService {
    private surce: string | undefined;
    private logLevel: number;

    constructor(source?: string) {
        this.surce = source;
        this.logLevel = (() => {
            const level = loadEnvVariable('LOG_LEVEL', '2');
            const parsed = parseInt(level.value, 10);
            if (isNaN(parsed) || parsed < 1 || parsed > 3) {
                return 2;
            }
            return parsed;
        })();
    }

    private _log(message: string, logType: LogType): void {
        if (this.logLevel <= 1 && (logType === 'INFO' || logType === 'VERBOSE')) return;
        if (this.logLevel <= 2 && logType === 'VERBOSE') return;

        const colorReset = '\x1b[0m';
        const date = new Date();

        const color = (() => {
            switch (logType) {
                case 'INFO':
                    return '\x1b[36m'; // cyan
                case 'WARN':
                    return '\x1b[33m'; // yellow
                case 'DANGER':
                case 'ERROR':
                    return '\x1b[31m'; // red
                case 'SUCCESS':
                    return '\x1b[32m'; // green
                case 'VERBOSE':
                    return '\x1b[90m'; // gray
                default:
                    return '\x1b[0m';
            }
        })();

        let log = '';
        log += color;
        log += '[';
        log += logType.slice(0, 3);
        log += ']';
        log += '[';
        log += date.toISOString();
        log += ']';
        if (this.surce) {
            log += `[${this.surce}]`;
        }
        log += colorReset;
        log += ' - ';
        log += message;
        console.log(log);
    }

    public middleware(method: string, url: string, ip?: string, user?: string): void {
        this.info(`${ip || 'Unknown'} ${user || 'Anonymous'} ${method} ${url}`);
    }

    public danger(message: string): void {
        this._log(message, 'DANGER');
    }

    public error(message: string): void {
        this._log(message, 'ERROR');
    }

    public warn(message: string): void {
        this._log(message, 'WARN');
    }

    public info(message: string): void {
        this._log(message, 'INFO');
    }

    public success(message: string): void {
        this._log(message, 'SUCCESS');
    }

    public verbose(message: string): void {
        this._log(message, 'VERBOSE');
    }
}

const logger = new LoggerService('Common');
export { logger, LoggerService as Logger };
