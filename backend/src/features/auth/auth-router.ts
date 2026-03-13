import express from 'express';
import passport from 'passport';
import { ApiError } from 'src/types/api-error';
import { getConfig, getUser, loginLocalError, loginLocalSuccess, logout } from './auth-controller';
import { ApiResponse } from '@shared/api-response';

const router = express.Router();

router.get('/config', getConfig);

router.get('/user', getUser);

router.post(
    '/callback/local',
    passport.authenticate('local', { session: true, failWithError: true }),
    loginLocalError,
    loginLocalSuccess
);

router.post('/callback/logout', logout);

export { router as authRouter };
