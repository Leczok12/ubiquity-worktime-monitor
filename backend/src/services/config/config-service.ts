import database from 'src/config/database';
import { log } from 'src/utils/log';
import { logger } from '../logger';
import { ConfigKey } from './config-types';
import { defaultValue } from './config-default';
import { ConfigKey } from './config-types';
import { exit } from 'node:process';

class Config {
    private async _isSet(key: ConfigKey): Promise<boolean> {
        const row = await database.prisma.configuration.findFirst({
            where: { key },
        });

        return !!row;
    }

    private async _setDefaultValue(key: ConfigKey): Promise<void> {
        const defaultConfigItem = defaultValue.find((config) => config.key === key);
        if (!defaultConfigItem) {
            //TODO: error handling
            logger.error(`No default for ${key}. Cannot set default value.`);
            exit(1);
        }
        
        await database.prisma.configuration.upsert({
            where: { key },
            update: { value: defaultConfigItem.value, type: defaultConfigItem.type },
            create: { key: defaultConfigItem.key as string, value: defaultConfigItem.value, type: defaultConfigItem.type },
        });
    }

    public async getValue(key: ConfigKey): Promise<> {
        
    }

    async initalize() {
        log('Initializing configuration', 'INFO');
        for (const config of defaultConfig) await this.getValue(config.key);

        await database.prisma.configuration.deleteMany({
            where: {
                key: { notIn: ConfigKeys },
            },
        });
    }

    async getValue(key: ConfigKeys): Promise<string | null> {
        const row = await database.prisma.configuration.findFirst({
            where: { key },
        });

        if (!row) {
            const defaultConfigItem = defaultConfig.find((config) => config.key === key);
            if (!defaultConfigItem) {
                throw new Error(`No default configuration found for key [${key}]`);
            }

            log(`Creating default configuration for [${key} = ${defaultConfigItem.value}]`, 'INFO');
            await database.prisma.configuration.create({
                data: {
                    key: defaultConfigItem.key,
                    value: defaultConfigItem.value,
                },
            });

            return defaultConfigItem.value;
        }

        return row.value;
    }

    async setValue(key: ConfigKeys, value: string): Promise<void> {
        await database.prisma.configuration.update({
            where: { key: key },
            data: { value: value },
        });
    }

    async getAllConfigs(): Promise<{ key: string; value: string }[]> {
        const configs = await database.prisma.configuration.findMany();
        return configs.map((config) => ({ key: config.key, value: config.value }));
    }
}

const config = new Config();

export default config;
