import { ApiResponse } from '@shared/types/api/api-response';
import { ENV } from '@src/config/enviroment';
import { ApiError } from '@src/types/api-error';
import express, { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import passport from 'passport';

const router = express.Router();

router.post(
    '/callback',
    passport.authenticate('local', { session: true, failWithError: true }),
    (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (err.status === 400) throw new ApiError(400, 'INVALID_ARGS');
        if (err.status === 401) throw new ApiError(401, 'INVALID_CREDENTIALS');
        else throw new ApiError(500, 'ERROR');
    },
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const response: ApiResponse<undefined> = {
            status: 'SUCCESS',
        };
        res.status(201).json(response);
    }
);

export { router as localRouter };
