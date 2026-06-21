import { ENV } from '@src/config/enviroment';
import { ApiError } from '@src/types/api-error';
import express, { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import passport from 'passport';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: Function) => {
    const targetRedirect = (req.query.redirect as string) || '/';

    if (!targetRedirect.startsWith('/')) throw new ApiError(400, 'INVALID_ARGS');

    const stateObj = { redirect: targetRedirect };
    const encodedState = Buffer.from(JSON.stringify(stateObj)).toString('base64');

    passport.authenticate('microsoft', {
        state: encodedState,
    })(req, res, next);
});

router.get('/callback', passport.authenticate('microsoft', { failureRedirect: '/login' }), (req, res) => {
    let finalRedirectUrl = '/';

    const stateStr = req.query.state as string;

    if (stateStr) {
        try {
            const decodedState = Buffer.from(stateStr, 'base64').toString('utf8');
            const stateObj = JSON.parse(decodedState);

            if (stateObj.redirect && stateObj.redirect.startsWith('/')) {
                finalRedirectUrl = stateObj.redirect;
            }
        } catch (error) {
            console.error('Błąd dekodowania parametru state:', error);
        }
    }

    res.redirect(`${ENV.APP_URL}${finalRedirectUrl}`);
});

export { router as microsoftRouter };
