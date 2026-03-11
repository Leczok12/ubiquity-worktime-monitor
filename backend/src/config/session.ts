import expressSession from 'express-session';

const session = expressSession({ secret: 'your-secret-key', resave: false, saveUninitialized: true });

export { session };
