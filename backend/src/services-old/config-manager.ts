import database from 'src/config/database';
import { log } from 'src/utils/log';

const defaultConfig = [
    { key: 'ubiquity-access-update-interval', value: '60000' },
    { key: 'ubiquity-access-on-fail-update-interval', value: '600' },
    { key: 'ubiquity-access-api-url', value: '' },
    { key: 'ubiquity-access-api-key', value: '' },
    { key: 'another-config', value: 'default-value' },
] as const;

export const ConfigKeys = defaultConfig.map((config) => config.key);

export type ConfigKeys = (typeof defaultConfig)[number]['key'];

class ConfigManager {
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

const configManager = new ConfigManager();

export default configManager;
