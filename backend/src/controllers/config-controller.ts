import { Request, Response } from 'express';
import { ApiError } from 'src/types/api-error';
import configManager, { ConfigKeys } from 'src/services/config-manager';
import { ApiResponse } from '@shared/api-response';
import { ApiConfigRow } from '@shared/api-config';

const getAllConfig = async (req: Request, res: Response) => {
    const response: ApiResponse<ApiConfigRow[]> = {
        message: 'Successfully retrieved all configurations',
        status: 'SUCCESS',
        data: await configManager.getAllConfigs(),
    };

    res.json(response);
};

const getValue = async (req: Request, res: Response) => {
    const { key } = req.params;
    if (ConfigKeys.includes(key as ConfigKeys)) throw new ApiError(400, `Invalid key parameter`);

    const response: ApiResponse<ApiConfigRow> = {
        message: `Successfully retrieved value for key: ${key}`,
        status: 'SUCCESS',
        data: { key: key as string, value: (await configManager.getValue(key as ConfigKeys)) ?? '' },
    };
    res.json(response);
};

const setValue = async (req: Request, res: Response) => {
    const { key } = req.params;
    if (ConfigKeys.includes(key as ConfigKeys)) throw new ApiError(400, `Invalid key parameter`);

    await configManager.setValue(key as ConfigKeys, req.body.value);

    const response: ApiResponse<ApiConfigRow> = {
        message: `Successfully set value for key: ${key}`,
        status: 'SUCCESS',
        data: { key: key as string, value: (await configManager.getValue(key as ConfigKeys)) ?? '' },
    };
    res.json(response);
};

export { getAllConfig, getValue, setValue };
