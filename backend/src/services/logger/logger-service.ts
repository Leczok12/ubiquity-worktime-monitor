import { LogType } from './logger-types';

class Logger {
    private _log(message: string, logType: LogType): void {
        console.log(`[${logType}] ${new Date().toISOString()} - ${message}`);
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

const logger = new Logger();
export default logger;
