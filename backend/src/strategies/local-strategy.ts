import { Strategy } from 'passport-local';

export const localStrategy = new Strategy((username, password, done) => {
    // User.findOne({ username: username }, function (err, user) {
    // 	if (err) return done(err);
    // 	if (!user) return done(null, false, { message: 'Incorrect username.' });

    // 	bcrypt.compare(password, user.password, function (err, res) {
    // 		if (err) return done(err);
    // 		if (res === false) return done(null, false, { message: 'Incorrect password.' });

    // 		return done(null, user);
    // 	});
    // });
    console.log('Authenticating user with username:', username);
    return done(null, { id: 1, username: 'testuser' });
});
