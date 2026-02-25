import { Request, Response } from 'express';
import { ApiError } from 'src/types/api-error';
import configManager, { ConfigKeys } from 'src/services/config-manager';
import { ApiResponse } from '@shared/api-response';
import { ApiConfigRow } from '@shared/api-config';
import { log } from 'src/utils/log';

const getAllConfig = async (req: Request, res: Response) => {
    const data = await configManager.getAllConfigs();

    if (data.length === 0) throw new ApiError(500, 'ERROR', 'Failed to retrieve config data');

    res.json({ status: 'SUCCESS', data: data } as ApiResponse<ApiConfigRow[]>);
};

const setValue = async (req: Request, res: Response) => {
    if (req.body.key === undefined || req.body.value === undefined) throw new ApiError(400, 'INVALID_ARGS');
    if (!ConfigKeys.includes(req.body.key))
        throw new ApiError(400, 'INVALID_ARGS', `Key ${req.body.key} is not a valid config key`);

    try {
        await configManager.setValue(req.body.key as ConfigKeys, req.body.value);
    } catch (error) {
        throw new ApiError(500, 'ERROR');
    }

    log(`Configuration [${req.body.key}] updated to [${req.body.value}]`, 'WARN');
    res.json({ status: 'SUCCESS' } as ApiResponse<ApiConfigRow>);
};

export { getAllConfig, setValue };
