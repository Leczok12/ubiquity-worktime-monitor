import passport from 'passport';
import { localStrategy } from './local-strategy';
import { database } from '../database';
import { User } from '@prisma/client';

passport.serializeUser<string>(async (user, done) => {
    console.log('Serializing user:', (user as User).id);
    done(null, (user as User).id);
});

passport.deserializeUser<string>(async (id, done) => {
    console.log('Deserializing user with id:', id);
    const user = await database.prisma.user.findUnique({ where: { id: String(id) } });

    console.log('Deserialized user:', user);

    done(null, user);
});

passport.use(localStrategy);

export { passport };
