import passport from 'passport';
import { localStrategy } from './local-strategy';
import { database } from '../database';
import { User } from '@prisma/client';
import { microsoftStrategy } from './microsoft-strategy';

passport.serializeUser<string>(async (user, done) => {
    done(null, user.id);
});

passport.deserializeUser<string>(async (id, done) => {
    const user = await database.prisma.user.findUnique({ where: { id: String(id) } });

    if (!user) return done(new Error('User not found'), null);

    const { password, ...userWithoutPassword } = user;
    done(null, userWithoutPassword);
});

passport.use(localStrategy);

if (microsoftStrategy) {
    passport.use(microsoftStrategy);
}

export { passport };
