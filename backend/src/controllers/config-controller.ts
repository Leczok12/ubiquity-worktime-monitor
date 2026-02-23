import { Request, Response } from 'express';
import { ApiError } from 'src/types/api-error';
import configManager, { ConfigKeys } from 'src/services/config-manager';
import { ApiResponse } from '@shared/api-response';
import { ApiConfigRow } from '@shared/api-config';
import { get } from 'node:http';

const getAllConfig = async (req: Request, res: Response) => {
    const data = await configManager.getAllConfigs();

    if (data.length === 0) throw new ApiError(500, 'ERROR', 'Failed to retrieve config data');

    res.json({ status: 'SUCCESS', data: data } as ApiResponse<ApiConfigRow[]>);
};

const setValue = async (req: Request, res: Response) => {
    if (req.body.key === undefined || req.body.value === undefined) throw new ApiError(400, 'INVALID_ARGS');

    try {
        await configManager.setValue(req.body.key as ConfigKeys, req.body.value);
    } catch (error) {
        throw new ApiError(500, 'ERROR');
    }

    res.status(200).json({ status: 'SUCCESS', data: data } as ApiResponse<ApiConfigRow>);
};

export { getAllConfig, setValue };
