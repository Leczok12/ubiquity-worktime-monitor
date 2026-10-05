export const loadEnvVariable = (
    variableName: string,
    defaultValue: string
): { value: string; isDev: boolean; isDefault: boolean } => {
    const DEV = process.env.DEV === 'true';

    const value =
        !!process.env[variableName] && process.env[variableName] !== ''
            ? process.env[variableName]!
            : undefined;

    const devValue =
        !!process.env[`DEV_${variableName}`] && process.env[`DEV_${variableName}`] !== ''
            ? process.env[`DEV_${variableName}`]!
            : undefined;

    if (DEV && devValue !== undefined) {
        return { value: devValue, isDev: true, isDefault: false };
    }
    if (value !== undefined) {
        return { value: value, isDev: false, isDefault: false };
    }
    return { value: defaultValue, isDev: false, isDefault: true };
};
