import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { database } from '@src/config/database';
import { ENV } from '@src/config/enviroment';

export const microsoftStrategy = ENV.MICROSOFT_ENABLED
    ? new MicrosoftStrategy(
          {
              clientSecret: ENV.MICROSOFT_CLIENT_SECRET ?? 'null',
              clientID: ENV.MICROSOFT_CLIENT_ID ?? 'null',
              callbackURL: `${ENV.APP_URL}/api/auth/microsoft/callback`,
              tenant: ENV.MICROSOFT_TENANT_ID ?? 'null',
              scope: ['user.read'],
          },
          async function (accessToken: string, refreshToken: string, profile: any, done: Function) {
              const user = await database.prisma.user.upsert({
                  where: { id: profile.id },
                  update: {
                      email: profile.userPrincipalName,
                      name: profile.name.givenName,
                      lastname: profile.name.familyName,
                      lastLogin: new Date(),
                  },
                  create: {
                      id: profile.id,
                      email: profile.userPrincipalName,
                      name: profile.name.givenName,
                      lastname: profile.name.familyName,
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
