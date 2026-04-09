import { database } from './database';
import argon2 from 'argon2';

export const createAdmin = async () => {
    const username = process.env.ADMIN_USERNAME ?? 'admin';
    const password = process.env.ADMIN_PASSWORD ?? 'admin';

    const admin = await database.prisma.user.findFirst({
        where: { email: username },
    });

    if (admin) {
        if (admin.role !== 'SYSTEM_ADMIN') {
            await database.prisma.user.update({
                where: { id: admin.id },
                data: { role: 'SYSTEM_ADMIN' },
            });
        }
        return;
    }

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
                role: 'SYSTEM_ADMIN',
                locked: false,
            },
        });
    } catch (error) {
        throw new Error(`Failed to create admin user: ${error instanceof Error ? error.message : error}`);
    }
    return;
};
