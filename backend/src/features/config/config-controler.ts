import { ApiConfigRowResponse } from '@shared/api-config';
import { ApiResponse } from '@shared/api-response';
import { Request, Response } from 'express';
import { config, ConfigKey, defaultConfig } from 'src/services/config';
import { ApiError } from 'src/types/api-error';

export const getAllConfig = async (req: Request, res: Response) => {
    const response: ApiResponse<ApiConfigRowResponse[]> = {
        status: 'SUCCESS',
        data: (await config.getAll()).map((row) => ({
            key: row.key as string,
            value: row.value.toString(),
            type: typeof row.value,
        })),
    };
    res.status(200).json(response);
};

export const setConfigValue = async (req: Request, res: Response) => {
    const rawKey = req.body.key;
    const rawValue = req.body.value;

    if (typeof rawKey !== 'string' || !(rawKey in defaultConfig)) {
        throw new ApiError(400, 'INVALID_ARGS');
    }
    if (typeof rawValue !== 'string') throw new ApiError(400, 'INVALID_ARGS');

    const key = rawKey as ConfigKey;
    const type = typeof defaultConfig[key];
    switch (type) {
        case 'number':
            if (isNaN(Number(rawValue))) {
                throw new ApiError(400, 'INVALID_ARGS');
            }
            await config.setValue(key, Number(rawValue));
            break;
        case 'boolean':
            if (rawValue !== 'true' && rawValue !== 'false') {
                throw new ApiError(400, 'INVALID_ARGS');
            }
            await config.setValue(key, rawValue === 'true');
            break;
        case 'string':
            await config.setValue(key, rawValue);
            break;
        default:
            throw new ApiError(400, 'INVALID_ARGS');
    }

    const response: ApiResponse<ApiConfigRowResponse[]> = {
        status: 'SUCCESS',
        data: (await config.getAll()).map((row) => ({
            key: row.key as string,
            value: row.value.toString(),
            type: typeof row.value,
        })),
    };
    res.status(200).json(response);
};
