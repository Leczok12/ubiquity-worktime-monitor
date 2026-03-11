import passport from 'passport';
import { localStrategy } from '../strategies';

passport.serializeUser(function (user, done) {
    console.log('Serializing user with id:', user);
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    // throw new Error('Deserialization not implemented yet');
    console.log('Deserializing user with id:', id);
    done(null, {
        id: '1',
        email: 'testuser@example.com',
        name: 'Test User',
        roles: ['EDITOR'],
        lastname: '',
        password: '',
        locked: false,
    });
});

passport.use(localStrategy);

export { passport };
