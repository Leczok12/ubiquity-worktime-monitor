import express from 'express';
import passport from 'passport';
import { ApiError } from 'src/types/api-error';
import { getConfig, loginLocalError, loginLocalSuccess, logout } from './auth-controller';
import { ApiResponse } from '@shared/api-response';

const router = express.Router();

router.get('/config', getConfig);

router.post(
    '/callback/local',
    passport.authenticate('local', { session: true, failWithError: true }),
    loginLocalError,
    loginLocalSuccess
);

router.post('/callback/logout', logout);

router.all('/', () => {
    throw new ApiError(404, 'NOT_FOUND');
});

export { router as authRouter };
