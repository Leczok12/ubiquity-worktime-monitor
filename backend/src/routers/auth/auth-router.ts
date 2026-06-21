import express, { Request, Response } from 'express';
import { microsoftRouter } from './microsoft-router';

const router = express.Router();

// router.use('/local', groupRouter);
if (process.env.MICROSOFT_ENABLED === 'true') {
    router.use('/microsoft', microsoftRouter);
}

router.get('/logout', (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ message: 'Successfully logged out' });
    });
});

export { router as authRouter };
