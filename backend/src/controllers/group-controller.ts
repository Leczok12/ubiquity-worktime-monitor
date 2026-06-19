import { Group } from '@prisma/client';
import { ApiCreateGroup, ApiUpdateGroup } from '@shared/types/api/api-group';
import { database } from '@src/config/database';
import { ApiError } from '@src/types/api-error';
import { PaginationWrapper } from '@src/types/pagination-warpper';

const groupController = () => {
    const createGroup: (data: ApiCreateGroup) => Promise<void> = async (data: ApiCreateGroup) => {
        if (data.id) {
            const existingGroup = await database.prisma.group.findUnique({
                where: { id: data.id },
            });

            if (existingGroup) throw new ApiError(400, 'INVALID_ARGS', 'Group with this ID already exists');
        }

        await database.prisma.group.create({
            data: {
                id: data.id,
                name: data.name,
                sync: data.sync ?? true,
            },
        });
    };

    const getGroup: (id: string, skipSync?: boolean) => Promise<Group> = async (id: string, skipSync?: boolean) => {
        const group = await database.prisma.group.findUnique({
            where: { id: id, sync: skipSync ? undefined : true },
        });

        if (!group) throw new ApiError(404, 'NOT_FOUND');

        return group;
    };

    const getGroups: (
        pageSize: number,
        pageNumber: number,
        skipSync?: boolean
    ) => Promise<PaginationWrapper<Group[]>> = async (pageSize, pageNumber, skipSync) => {
        const groupWhere = { sync: skipSync ? undefined : true };

        const groups = await database.prisma.group.findMany({
            take: pageSize,
            skip: (pageNumber - 1) * pageSize,
            where: groupWhere,
            orderBy: [{ name: 'asc' }],
        });

        return {
            data: groups,
            pagination: {
                page: pageNumber,
                pageSize: pageSize,
                total: await database.prisma.group.count({
                    where: groupWhere,
                }),
            },
        };
    };

    const updateGroup = async (id: string, data: ApiUpdateGroup) => {
        const { count } = await database.prisma.group.updateMany({
            where: { id: id },
            data: {
                name: data.name,
                sync: data.sync,
            },
        });

        if (count === 0) throw new ApiError(404, 'NOT_FOUND');
    };

    const deleteGroup: (id: string) => Promise<void> = async (id: string) => {
        const { count } = await database.prisma.group.deleteMany({
            where: { id: id },
        });

        if (count === 0) throw new ApiError(404, 'NOT_FOUND');
    };

    return { createGroup, getGroup, getGroups, updateGroup, deleteGroup };
};

export { groupController };
