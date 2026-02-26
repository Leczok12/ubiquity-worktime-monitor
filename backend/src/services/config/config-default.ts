import { ConfigItem } from './config-types';

export const defaultValue: ConfigItem[] = [
    { key: 'ubiquity-access-update-interval', value: '60000', type: 'number' },
    { key: 'ubiquity-access-on-fail-update-interval', value: '600', type: 'number' },
    { key: 'ubiquity-access-api-url', value: '', type: 'string' },
    { key: 'ubiquity-access-api-key', value: '', type: 'string' },
    { key: 'another-config', value: 'default-value', type: 'string' },
];
