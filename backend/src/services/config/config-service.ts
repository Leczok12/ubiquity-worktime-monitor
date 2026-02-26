import { database } from 'src/services/database';
import { log } from 'src/utils/log';
import { logger } from '../logger';
import { defaultConfig } from './config-default';
import { ConfigKey, Config } from './config-types';
import { exit } from 'node:process';

class ConfigService {
    public async initialize(): Promise<void> {
        logger.info('Initializing configuration');
        for (const key in defaultConfig) {
            const row = await database.prisma.configuration.findFirst({
                where: { key: key },
            });

            if (!row) {
                await this._setValue(key as ConfigKey, defaultConfig[key as ConfigKey]);
                logger.info(`Created config key [${key} = ${defaultConfig[key as ConfigKey]}]`);
            }
        }

        const obsoleteKeys = await database.prisma.configuration.findMany({
            where: { NOT: { key: { in: Object.keys(defaultConfig) } } },
        });

        for (const key of obsoleteKeys.map((k) => k.key)) {
            await database.prisma.configuration.delete({ where: { key } });
            logger.info(`Removed obsolete config key [${key}]`);
        }
    }

    public async setValue<K extends ConfigKey>(key: K, value: Config[K]): Promise<void> {
        logger.warn(`Setting config key [${key} = ${value}]`);
        await this._setValue(key, value);
    }

    public async getValue<K extends ConfigKey>(key: K): Promise<Config[K]> {
        const row = await database.prisma.configuration.findFirst({
            where: { key },
        });

        if (!row) {
            const value = defaultConfig[key];
            this.setValue(key, value);
            return value;
        }

        return this._parseValue(row.value, row.type) as Config[K];
    }

    private async _setValue<K extends ConfigKey>(key: K, value: Config[K]): Promise<void> {
        await database.prisma.configuration.upsert({
            where: { key },
            update: { value: value.toString() },
            create: { key, value: value.toString(), type: typeof defaultConfig[key] },
        });
    }

    private _parseValue(value: string, type: string): number | boolean | string {
        switch (type) {
            case 'number':
                return Number(value);
            case 'boolean':
                return value === 'true';
            default:
                return value;
        }
    }
}

const config = new ConfigService();

export default config;
