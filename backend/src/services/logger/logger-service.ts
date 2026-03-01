import { Request, Response, NextFunction } from 'express';
import { LogType } from './logger-types';

class LoggerService {
    private _log(message: string, logType: LogType): void {
        const colorReset = '\x1b[0m';
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
                case 'DEBUG':
                    return '\x1b[34m'; // blue
                default:
                    return '\x1b[0m';
            }
        })();

        console.log(`${color}[${logType}]${new Date().toISOString()} - ${message}${colorReset}`);
    }

    public middleware(req: Request, res: Response, next: NextFunction): void {
        this.info(`${req.method} ${req.url}`);
        next();
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

    public debug(message: string): void {
        this._log(message, 'DEBUG');
    }
}

const logger = new LoggerService();
export default logger;
