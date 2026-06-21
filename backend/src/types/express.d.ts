import 'express-session';
import { User as PrismaUser } from '@prisma/client';
declare global {
    namespace Express {
        interface User extends Omit<PrismaUser, 'password'> {}
    }
}

declare module 'express-session' {
    interface SessionData {
        redirectTo: string | undefined;
    }
}
