import { Group, Worker } from '@prisma/client';
import { ApiCreateGroup, ApiUpdateGroup } from '@shared/types/api/api-group';
import { ApiCreateUser, ApiGetUser, ApiUpdateUser } from '@shared/types/api/api-user';
import { logger } from '@src/utils/logger';
import { database } from '@src/config/database';
import { ApiError } from '@src/types/api-error';
import { PaginationWrapper } from '@src/types/pagination-warpper';
import argon2 from 'argon2';

const userController = () => {
    const createUser: (data: ApiCreateUser) => Promise<void> = async (data: ApiCreateUser) => {
        await database.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                lastname: data.lastname,
                role: data.role,
                password: await argon2.hash(data.password),
                createdAt: new Date(),
            },
        });

        logger.success(`User created: ${data.email}`);
    };

    const getUser: (id: string) => Promise<ApiGetUser> = async (id: string) => {
        const user = await database.prisma.user.findUnique({
            where: { id: id },
        });

        if (!user) throw new ApiError(404, 'NOT_FOUND');

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            role: user.role as ApiGetUser['role'],
            lastLogin: user.lastLogin?.toISOString(),
            lastActivity: user.lastActivity?.toISOString() ?? undefined,
        };
    };

    const getUsers: (
        pageSize: number,
        pageNumber: number
    ) => Promise<PaginationWrapper<ApiGetUser[]>> = async (pageSize, pageNumber) => {
        const users = await database.prisma.user.findMany({
            take: pageSize,
            skip: (pageNumber - 1) * pageSize,
            orderBy: [{ lastname: 'asc' }, { name: 'asc' }],
        });

        const totalUsers = await database.prisma.user.count();

        const apiUsers: ApiGetUser[] = users.map((user) => ({
            id: user.id,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            role: user.role as ApiGetUser['role'],
            lastLogin: user.lastLogin?.toISOString(),
            lastActivity: user.lastActivity?.toISOString(),
        }));

        return {
            data: apiUsers,
            pagination: {
                page: pageNumber,
                pageSize: pageSize,
                total: totalUsers,
            },
        };
    };

    const updateUser: (id: string, data: ApiUpdateUser) => Promise<void> = async (
        id: string,
        data: ApiUpdateUser
    ) => {
        const { count } = await database.prisma.user.updateMany({
            where: { id: id },
            data: {
                role: data.role,
            },
        });

        if (count === 0) throw new ApiError(404, 'NOT_FOUND');
        logger.warn(`User updated: ${id}`);
    };

    return { createUser, getUser, getUsers, updateUser };
};

export { userController };
