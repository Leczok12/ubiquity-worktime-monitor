import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { database } from '@src/config/database';
import { ENV } from '@src/config/enviroment';

export const googleStrategy = ENV.GOOGLE_ENABLED
    ? new GoogleStrategy(
          {
              clientSecret: ENV.GOOGLE_CLIENT_SECRET ?? 'null',
              clientID: ENV.GOOGLE_CLIENT_ID ?? 'null',
              callbackURL: `${ENV.APP_URL}/api/auth/google/callback`,
              passReqToCallback: true,
              scope: ['profile', 'email'],
          },
          async function (
              request: any,
              accessToken: string,
              refreshToken: string,
              profile: any,
              done: Function
          ) {
              const worker = await database.prisma.worker.findMany({
                  where: { email: profile.email },
              });
              console.log('Google profile:', profile.provider);
              const user = await database.prisma.user.upsert({
                  where: { id: profile.id },
                  update: {
                      workerId: worker.length > 0 ? worker[0].id : null,
                      email: profile.email,
                      name: profile.given_name,
                      lastname: profile.family_name,
                      lastLogin: new Date(),
                  },
                  create: {
                      workerId: worker.length > 0 ? worker[0].id : null,
                      id: profile.id,
                      email: profile.email,
                      name: profile.given_name,
                      lastname: profile.family_name,
                      lastLogin: new Date(),
                      isLocal: false,
                      createdAt: new Date(),
                      isLocked: false,
                      isPasswordChange: false,
                      role: 'WORKER',
                      password: null,
                  },
              });

              return done(null, user);
          }
      )
    : null;
