import { Strategy } from 'passport-local';
import { database } from 'src/config/database';
import argon2 from 'argon2';

export const localStrategy = new Strategy(async (username, password, done) => {
    const user = await database.prisma.user.findFirst({ where: { email: username } });

    if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
    }

    try {
        if (!(await argon2.verify(user.password, password))) {
            return done(null, false, { message: 'Invalid credentials' });
        }
    } catch (err) {
        return done(null, false, { message: 'Invalid credentials' });
    }

    return done(null, user);
});
