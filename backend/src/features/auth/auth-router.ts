import express from 'express';
import passport from 'passport';
import { ApiError } from 'src/types/api-error';
import { logout } from './auth-controller';
import { ApiResponse } from '@shared/api-response';

const router = express.Router();

router.post(
    '/callback/local',
    passport.authenticate('local', { session: true, failureMessage: 'Invalid credentials' }),
    (req: express.Request, res: express.Response) => {
        console.log('User authenticated successfully:', { user: req.user });

        // Usuń hasło przed wysłaniem
        const { password, ...userWithoutPassword } = req.user!;

        const response: ApiResponse<typeof userWithoutPassword> = {
            status: 'SUCCESS',
            data: userWithoutPassword,
        };

        res.status(200).json(response);
    }
);
// router.post(
//     '/callback/local',
//     passport.authenticate('local', { session: true, failureMessage: 'ssdfsdf' }),
//     (req: express.Request, res: express.Response) => {
//         console.log('User authenticated successfully:', { user: req.user });
//         const response: ApiResponse<undefined> = {
//             status: req.isAuthenticated() ? 'SUCCESS' : 'ERROR',
//         };

//         res.status(200).json(response);
//     }
// );

router.post('/callback/logout', logout);

router.all('/', () => {
    throw new ApiError(404, 'NOT_FOUND');
});

export { router as authRouter };
