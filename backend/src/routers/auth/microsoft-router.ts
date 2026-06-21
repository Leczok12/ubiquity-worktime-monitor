import express, { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import passport from 'passport';

const router = express.Router();

const normalizeRedirectTo = (value: unknown) => {
    if (typeof value !== 'string' || !value.startsWith('/')) {
        return '/';
    }

    return value;
};

router.get('/', passport.authenticate('microsoft', { prompt: 'select_account' }));

router.get(
    '/callback',
    passport.authenticate('microsoft', { failureRedirect: '/login' }),
    (req: Request, res: Response) => {
        req.user = req.user as Express.User;
        res.redirect('/');
    }
);

export { router as microsoftRouter };
function saveSession(session: Session & Partial<SessionData>) {
    throw new Error('Function not implemented.');
}
