import { logger } from '@src/utils/logger';
import { database } from '@src/config/database';
import { environment as env } from '@src/services/environment';
import { userController } from '@src/controllers/user-controller';

export const initAdmin = async () => {
    const existingAdmin = await database.prisma.user.findFirst({
        where: { email: env.ADMIN_DEFAULT_LOGIN },
    });

    if (!existingAdmin) {
        userController().createUser({
            email: env.ADMIN_DEFAULT_LOGIN,
            name: 'Admin',
            lastname: 'Admin',
            role: 'SYSTEM_ADMIN',
            password: env.ADMIN_DEFAULT_PASSWORD,
        });
        logger.info(
            `Default admin user created. Login: ${env.ADMIN_DEFAULT_LOGIN} Password: ${env.ADMIN_DEFAULT_PASSWORD}`
        );
    }
};
