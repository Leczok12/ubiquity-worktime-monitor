import expressSession from 'express-session';
import { database } from '@src/config/database';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

const session = expressSession({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    store: new PrismaSessionStore(database.prisma, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    }),
});

export { session };
