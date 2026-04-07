import express from 'express';
import { ApiResponse } from '@shared/api-response';
import { Request, Response } from 'express';
import { ApiError } from 'src/types/api-error';
import { ApiAuthChangePasswordRequest, ApiAuthConfigResponse } from '@shared/api-auth';
import { config } from 'src/services/config';
import { ApiAuthUserResponse } from '@shared/api-auth';
import z from 'zod';
import argon2 from 'argon2';
import { database } from 'src/config/database';

export const getConfig = async (req: express.Request, res: express.Response) => {
    const response: ApiResponse<ApiAuthConfigResponse> = {
        status: 'SUCCESS',
        data: {
            local: {
                label: await config.getValue('LOGIN_LOCAL_LABEL'),
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

const changePasswordSchema: z.Schema<ApiAuthChangePasswordRequest> = z.object({
    password: z.string(),
    passwordConfirm: z.string(),
});

export const changePassword = async (req: Request, res: Response) => {
    const data = changePasswordSchema.safeParse(req.body);

    if (data.success === false)
        throw new ApiError(400, 'INVALID_ARGS', data.error.issues.map((issue) => issue.message).join(', '));

    if (data.data.password !== data.data.passwordConfirm)
        throw new ApiError(400, 'INVALID_ARGS', 'Passwords do not match');

    if (data.data.password.length < 8)
        throw new ApiError(400, 'INVALID_ARGS', 'Password must be at least 8 characters long');

    if (data.data.password.length > 128)
        throw new ApiError(400, 'INVALID_ARGS', 'Password must be at most 128 characters long');

    if (data.data.password.search(/[A-Z]/) === -1)
        throw new ApiError(400, 'INVALID_ARGS', 'Password must contain at least one uppercase letter');
    if (data.data.password.search(/[a-z]/) === -1)
        throw new ApiError(400, 'INVALID_ARGS', 'Password must contain at least one lowercase letter');
    if (data.data.password.search(/[0-9]/) === -1)
        throw new ApiError(400, 'INVALID_ARGS', 'Password must contain at least one number');
    if (data.data.password.search(/[^A-Za-z0-9]/) === -1)
        throw new ApiError(400, 'INVALID_ARGS', 'Password must contain at least one special character');

    const { count } = await database.prisma.user.updateMany({
        where: { id: req.user?.id },
        data: {
            password: await argon2.hash(data.data.password),
        },
    });

    if (count === 0) {
        throw new ApiError(500, 'ERROR');
    }

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
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
