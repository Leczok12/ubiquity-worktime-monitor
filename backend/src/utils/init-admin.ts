import { logger } from '@shared/utils/logger';
import { database } from '@src/config/database';
import { ENV } from '@src/config/enviroment';
import { userController } from '@src/controllers/user-controller';

export const initAdmin = async () => {
    const existingAdmin = await database.prisma.user.findFirst({
        where: { email: ENV.ADMIN_DEFAULT_LOGIN },
    });

    if (!existingAdmin) {
        userController().createUser({
            email: ENV.ADMIN_DEFAULT_LOGIN,
            name: 'Admin',
            lastname: 'Admin',
            role: 'SYSTEM_ADMIN',
            password: ENV.ADMIN_DEFAULT_PASSWORD,
        });
        logger.info(
            `Default admin user created. Login: ${ENV.ADMIN_DEFAULT_LOGIN} Password: ${ENV.ADMIN_DEFAULT_PASSWORD}`
        );
    }
};
