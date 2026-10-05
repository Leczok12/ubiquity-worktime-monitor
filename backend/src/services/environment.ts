import { loadEnvVariable } from '@src/utils/load-env-variable';
import { Logger } from '@src/utils/logger';

class Environment {
    // Server configuration
    public readonly DEV;
    public readonly SERVER_PORT;
    public readonly SERVER_URL;
    public readonly DEV_FRONTEND_URL;
    public readonly LOG_LEVEL;
    public readonly TZ;
    public readonly ADMIN_DEFAULT_LOGIN;
    public readonly ADMIN_DEFAULT_PASSWORD;

    // Application configuration
    public readonly END_OF_DAY_OFFSET;
    public readonly DISPLAY_DATE_OFFSET;

    // Ubiquiti configuration
    public readonly UBIQUITI_FULL_SYNC_CRON;
    public readonly UBIQUITI_PARTIAL_SYNC_CRON;
    public readonly UBIQUITI_HOST;
    public readonly UBIQUITI_API_KEY;
    public readonly UBIQUITI_SYNC_ON_STARTUP;
    public readonly UBIQUITI_NEW_WORKER_DEFAULT_SHOW;
    public readonly UBIQUITI_NEW_GROUP_DEFAULT_SHOW;

    // Microsoft configuration
    public readonly MICROSOFT_ENABLED;
    public readonly MICROSOFT_LOGIN_LABEL;
    public readonly MICROSOFT_CLIENT_ID;
    public readonly MICROSOFT_CLIENT_SECRET;
    public readonly MICROSOFT_TENANT_ID;

    // Google configuration
    public readonly GOOGLE_ENABLED;
    public readonly GOOGLE_LOGIN_LABEL;
    public readonly GOOGLE_CLIENT_ID;
    public readonly GOOGLE_CLIENT_SECRET;

    private logger = new Logger('Environment');

    private loadEnvVariable(
        variableName: string,
        defaultValue: string,
        secure: boolean = false
    ): { value: string; isDev: boolean; isDefault: boolean } {
        const data = loadEnvVariable(variableName, defaultValue);

        if (data.isDev) {
            this.logger.verbose(
                `loaded 'DEV_${variableName}' = '${secure ? '***' + data.value.slice(data.value.length - 2, data.value.length) : data.value}'`
            );
        }

        if (!data.isDev && !data.isDefault) {
            this.logger.verbose(
                `loaded '${variableName}' = '${secure ? '***' + data.value.slice(data.value.length - 2, data.value.length) : data.value}'`
            );
        }

        if (data.isDefault) {
            this.logger.verbose(`loaded default '${variableName}' = '${data.value}'`);
        }

        return { value: data.value, isDev: data.isDev, isDefault: data.isDefault };
    }

    public constructor() {
        this.DEV = process.env.DEV === 'true';
        this.logger.verbose(`loaded 'DEV' = '${this.DEV}'`);

        this.SERVER_PORT = this.loadEnvVariable('SERVER_PORT', '3000').value;
        this.SERVER_URL = this.loadEnvVariable('SERVER_URL', 'http://localhost:3000').value;
        this.DEV_FRONTEND_URL = this.loadEnvVariable(
            'DEV_FRONTEND_URL',
            'http://localhost:5173'
        ).value;
        this.LOG_LEVEL = (() => {
            const level = this.loadEnvVariable('LOG_LEVEL', '2');
            const parsed = parseInt(level.value, 10);
            if (isNaN(parsed) || parsed < 1 || parsed > 3) {
                this.logger.warn(
                    `Invalid '${level.isDev ? 'DEV_' : ''}LOG_LEVEL' value '${level.value}', defaulting to 2`
                );
                return 2;
            }
            return parsed;
        })();
        this.TZ = this.loadEnvVariable('TZ', 'UTC').value;
        process.env.TZ = this.TZ;

        this.ADMIN_DEFAULT_LOGIN = this.loadEnvVariable('ADMIN_DEFAULT_LOGIN', 'admin').value;
        this.ADMIN_DEFAULT_PASSWORD = this.loadEnvVariable(
            'ADMIN_DEFAULT_PASSWORD',
            'admin',
            true
        ).value;

        this.END_OF_DAY_OFFSET = (() => {
            const offset = this.loadEnvVariable('END_OF_DAY_OFFSET', '0');
            const parsed = parseInt(offset.value, 10);

            if (parsed < -720 || parsed > 720) {
                this.logger.warn(
                    `Invalid '${offset.isDev ? 'DEV_' : ''}END_OF_DAY_OFFSET' value '${offset.value}', defaulting to 0`
                );
                return 0;
            }
            return parsed;
        })();
        this.DISPLAY_DATE_OFFSET = (() => {
            const offset = this.loadEnvVariable('DISPLAY_DATE_OFFSET', '0');
            const parsed = parseInt(offset.value, 10);

            if (parsed < -720 || parsed > 720) {
                this.logger.warn(
                    `Invalid '${offset.isDev ? 'DEV_' : ''}DISPLAY_DATE_OFFSET' value '${offset.value}', defaulting to 0`
                );
                return 0;
            }
            return parsed;
        })();

        this.UBIQUITI_FULL_SYNC_CRON = this.loadEnvVariable(
            'UBIQUITI_FULL_SYNC_CRON',
            '0 0 * * *'
        ).value;
        this.UBIQUITI_PARTIAL_SYNC_CRON = this.loadEnvVariable(
            'UBIQUITI_PARTIAL_SYNC_CRON',
            '*/15 * * * *'
        ).value;
        this.UBIQUITI_HOST = this.loadEnvVariable('UBIQUITI_HOST', '').value;
        this.UBIQUITI_API_KEY = this.loadEnvVariable('UBIQUITI_API_KEY', '', true).value;
        this.UBIQUITI_SYNC_ON_STARTUP =
            this.loadEnvVariable('UBIQUITI_SYNC_ON_STARTUP', 'false').value === 'true';
        this.UBIQUITI_NEW_WORKER_DEFAULT_SHOW =
            this.loadEnvVariable('UBIQUITI_NEW_WORKER_DEFAULT_SHOW', 'true').value === 'true';
        this.UBIQUITI_NEW_GROUP_DEFAULT_SHOW =
            this.loadEnvVariable('UBIQUITI_NEW_GROUP_DEFAULT_SHOW', 'true').value === 'true';

        this.MICROSOFT_ENABLED =
            this.loadEnvVariable('MICROSOFT_ENABLED', 'false').value === 'true';
        this.MICROSOFT_LOGIN_LABEL = this.loadEnvVariable(
            'MICROSOFT_LOGIN_LABEL',
            'Login with Microsoft'
        ).value;
        this.MICROSOFT_CLIENT_ID = this.loadEnvVariable('MICROSOFT_CLIENT_ID', '').value;
        this.MICROSOFT_CLIENT_SECRET = this.loadEnvVariable(
            'MICROSOFT_CLIENT_SECRET',
            '',
            true
        ).value;
        this.MICROSOFT_TENANT_ID = this.loadEnvVariable('MICROSOFT_TENANT_ID', '').value;

        this.GOOGLE_ENABLED = this.loadEnvVariable('GOOGLE_ENABLED', 'false').value === 'true';
        this.GOOGLE_LOGIN_LABEL = this.loadEnvVariable(
            'GOOGLE_LOGIN_LABEL',
            'Login with Google'
        ).value;
        this.GOOGLE_CLIENT_ID = this.loadEnvVariable('GOOGLE_CLIENT_ID', '').value;
        this.GOOGLE_CLIENT_SECRET = this.loadEnvVariable('GOOGLE_CLIENT_SECRET', '', true).value;
    }
}

const environment = new Environment();

export { environment };
