class Logger {}

const logger = new Logger();
export default logger;

export const log = (message: string, logLevel?: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS'): void => {
    const level = logLevel || 'INFO';
    const colorReset = '\x1b[0m';
    const color = (() => {
        switch (level) {
            case 'INFO':
                return '\x1b[36m'; // cyan
            case 'WARN':
                return '\x1b[33m'; // yellow
            case 'ERROR':
                return '\x1b[31m'; // red
            case 'SUCCESS':
                return '\x1b[32m'; // green
            default:
                return '\x1b[0m';
        }
    })();

    console.log(`${color}${level}\t${new Date().toISOString()}\t${message}${colorReset}`);
};
