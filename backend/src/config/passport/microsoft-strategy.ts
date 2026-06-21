import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { database } from '../database';

export const microsoftStrategy =
    process.env.MICROSOFT_ENABLED === 'true'
        ? new MicrosoftStrategy(
              {
                  clientSecret: process.env.MICROSOFT_CLIENT_SECRET ?? 'null',
                  clientID: process.env.MICROSOFT_CLIENT_ID ?? 'null',
                  callbackURL: `${process.env.MICROSOFT_CALLBACK_DOMAIN}/api/auth/microsoft/callback`,
                  tenant: process.env.MICROSOFT_TENANT_ID ?? 'null',
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
