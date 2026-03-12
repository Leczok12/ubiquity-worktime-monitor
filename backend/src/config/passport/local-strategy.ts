import { Strategy } from 'passport-local';
import { database } from 'src/config/database';
import argon2 from 'argon2';

export const localStrategy = new Strategy(async (username, password, done) => {
    console.log('Local strategy called with username:', username);

    const user = await database.prisma.user.findFirst({ where: { email: username } });

    if (!user) {
        console.log('User not found with email:', username);
        return done(null, false, { message: 'Invalid credentials' });
    }

    console.log('User found:', user.email);

    try {
        const isValid = await argon2.verify(user.password, password);
        console.log('Password verification result:', isValid);

        if (!isValid) {
            console.log('Invalid password for user:', username);
            return done(null, false, { message: 'Invalid credentials' });
        }
    } catch (err) {
        console.log('Error verifying password:', err);
        return done(null, false, { message: 'Invalid credentials' });
    }

    console.log('User authenticated successfully, returning user:', user.id);
    return done(null, user);
});
