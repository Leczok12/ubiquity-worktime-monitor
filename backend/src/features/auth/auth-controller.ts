import express from 'express';
import { ApiResponse } from '@shared/api-response';
import { Request, Response } from 'express';
import { ApiError } from 'src/types/api-error';
import { ApiLoginConfigResponse } from '@shared/api-login-config';
import { config } from 'src/services/config';
import { ApiAuthUserResponse } from '@shared/api-auth';

export const getConfig = async (req: express.Request, res: express.Response) => {
    const response: ApiResponse<ApiLoginConfigResponse> = {
        status: 'SUCCESS',
        data: {
            local: {
                enabled: await config.getValue('LOGIN_LOCAL_STRATEGY_ENABLED'),
            },
            microsoft: {
                label: await config.getValue('LOGIN_MICROSOFT_LABEL'),
                enabled: await config.getValue('LOGIN_MICROSOFT_STRATEGY_ENABLED'),
            },
        },
    };

    res.status(200).json(response);
};

export const getUser = async (req: Request, res: Response) => {
    if (!req.user) {
        throw new ApiError(401, 'UNAUTHORIZED');
    }

    const response: ApiResponse<ApiAuthUserResponse> = {
        status: 'SUCCESS',
        data: req.user,
    };

    res.status(200).json(response);
};

export const loginLocalError = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.status === 400) throw new ApiError(400, 'INVALID_ARGS');
    if (err.status === 401) throw new ApiError(401, 'INVALID_CREDENTIALS');
    else throw new ApiError(500, 'ERROR');
};

export const loginLocalSuccess = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };
    res.status(201).json(response);
};

export const logout = async (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                status: 'ERROR',
                message: 'Logout error',
            });
        }

        req.session.destroy((destroyErr) => {
            if (destroyErr) {
                return res.status(500).json({
                    status: 'ERROR',
                    message: 'Session destroy error',
                });
            }

            res.clearCookie('connect.sid');

            const response: ApiResponse<undefined> = {
                status: 'SUCCESS',
            };

            res.status(200).json(response);
        });
    });
};
