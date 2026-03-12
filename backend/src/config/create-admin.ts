import { database } from './database';
import argon2 from 'argon2';

export const createAdmin = async () => {
    const admin = await database.prisma.user.findFirst({
        where: { roles: { hasSome: ['SYSTEM_ADMIN'] } },
    });

    if (admin) {
        return;
    }

    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        throw new Error('Admin credentials are not set in environment variables (ADMIN_USERNAME and ADMIN_PASSWORD)');
    }

    try {
        await database.prisma.user.create({
            data: {
                email: username,
                lastname: '',
                name: username,
                password: await argon2.hash(password),
                roles: ['SYSTEM_ADMIN'],
                locked: false,
            },
        });
    } catch (error) {
        throw new Error(`Failed to create admin user: ${error instanceof Error ? error.message : error}`);
    }
    return;
};
