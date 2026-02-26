export type ConfigItemKey =
    | 'ubiquity-access-update-interval'
    | 'ubiquity-access-on-fail-update-interval'
    | 'ubiquity-access-api-url'
    | 'ubiquity-access-api-key'
    | 'another-config';

export type ConfigItemType = 'string' | 'number' | 'boolean';

export type ConfigItem = {
    key: ConfigItemKey;
    value: string;
    type: ConfigItemType;
};
