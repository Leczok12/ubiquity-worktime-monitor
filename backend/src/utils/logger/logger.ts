import { LogType } from './logger-types';
import { ENV } from '@src/config/enviroment';

class LoggerService {
    private surce: string | undefined;

    constructor(source?: string) {
        this.surce = source;
    }

    private _log(message: string, logType: LogType): void {
        if (ENV.LOG_LEVEL <= 1 && (logType === 'INFO' || logType === 'VERBOSE')) return;
        if (ENV.LOG_LEVEL <= 2 && logType === 'VERBOSE') return;

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
