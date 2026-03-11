import { ApiConfigRowResponse } from '@shared/api-config';
import { ApiResponse } from '@shared/api-response';
import { Request, Response } from 'express';
import { config, ConfigKey, defaultConfig } from 'src/services/config';
import { ApiError } from 'src/types/api-error';

export const logout = async (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) throw new ApiError(500, 'ERROR');
    });

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };

    res.status(200).json(response);
};
