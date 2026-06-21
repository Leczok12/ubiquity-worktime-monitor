import { Strategy as LocalStartegy } from 'passport-local';
import { database } from '@src/config/database';
import argon2 from 'argon2';

export const localStrategy = new LocalStartegy(async (username, password, done) => {
    const user = await database.prisma.user.findFirst({
        where: { AND: [{ email: username }, { isLocal: true }] },
    });

    if (!user || !user.password) return done(null, false, { message: 'Invalid credentials' });

    try {
        const isValid = await argon2.verify(user.password, password);

        if (!isValid) return done(null, false, { message: 'Invalid credentials' });
    } catch (err) {
        return done(null, false, { message: 'Invalid credentials' });
    }
    return done(null, user);
});
