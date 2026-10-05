import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { database } from '@src/config/database';
import { environment as env } from '@src/services/environment';

export const microsoftStrategy = env.MICROSOFT_ENABLED
    ? new MicrosoftStrategy(
          {
              clientSecret: env.MICROSOFT_CLIENT_SECRET ?? 'null',
              clientID: env.MICROSOFT_CLIENT_ID ?? 'null',
              callbackURL: `${env.SERVER_URL}/api/auth/microsoft/callback`,
              tenant: env.MICROSOFT_TENANT_ID ?? 'null',
              scope: ['user.read'],
          },
          async function (accessToken: string, refreshToken: string, profile: any, done: Function) {
              const worker = await database.prisma.worker.findMany({
                  where: { email: profile.userPrincipalName },
              });

              const user = await database.prisma.user.upsert({
                  where: { id: profile.id },
                  update: {
                      workerId: worker.length > 0 ? worker[0].id : null,
                      email: profile.userPrincipalName,
                      name: profile.name.givenName,
                      lastname: profile.name.familyName,
                      lastLogin: new Date(),
                  },
                  create: {
                      workerId: worker.length > 0 ? worker[0].id : null,
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
