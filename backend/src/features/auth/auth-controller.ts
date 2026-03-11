import { ApiConfigRowResponse } from '@shared/api-config';
import { ApiResponse } from '@shared/api-response';
import { Request, Response } from 'express';
import { config, ConfigKey, defaultConfig } from 'src/services/config';
import { ApiError } from 'src/types/api-error';

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
