import { Group, Worker } from '@prisma/client';
import { ApiCreateGroup, ApiUpdateGroup } from '@shared/types/api/api-group';
import { logger } from '@shared/utils/logger';
import { database } from '@src/config/database';
import { ApiError } from '@src/types/api-error';
import { PaginationWrapper } from '@src/types/pagination-warpper';

const groupController = () => {
    const createGroup: (data: ApiCreateGroup) => Promise<void> = async (data: ApiCreateGroup) => {
        if (data.id) {
            const existingGroup = await database.prisma.group.findUnique({
                where: { id: data.id },
            });

            if (existingGroup)
                throw new ApiError(400, 'INVALID_ARGS', 'Group with this ID already exists');
        }

        await database.prisma.group.create({
            data: {
                id: data.id,
                name: data.name,
                show: data.show ?? true,
            },
        });

        logger.success(`Group created: ${data.id}`);
    };

    const getGroup: (id: string, skipShow?: boolean) => Promise<Group> = async (
        id: string,
        skipShow?: boolean
    ) => {
        const group = await database.prisma.group.findUnique({
            where: { id: id, show: skipShow ? undefined : true },
        });

        if (!group) throw new ApiError(404, 'NOT_FOUND');

        return group;
    };

    const getGroups: (
        pageSize: number,
        pageNumber: number,
        skipShow?: boolean
    ) => Promise<PaginationWrapper<Group[]>> = async (pageSize, pageNumber, skipShow) => {
        const groupWhere = { show: skipShow ? undefined : true };

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

    const getGroupWorkers: (
        id: string,
        pageSize: number,
        pageNumber: number,
        skipShow?: boolean
    ) => Promise<PaginationWrapper<Worker[]>> = async (
        id: string,
        pageSize: number,
        pageNumber: number,
        skipShow?: boolean
    ) => {
        const group = await database.prisma.group.findUnique({
            where: { id: id, show: skipShow ? undefined : true },
        });

        if (!group) throw new ApiError(404, 'NOT_FOUND');

        const workers = await database.prisma.worker.findMany({
            take: pageSize,
            skip: (pageNumber - 1) * pageSize,
            where: {
                groups: { some: { id: id } },
                show: skipShow ? undefined : true,
            },
            orderBy: [{ lastname: 'asc' }, { name: 'asc' }],
        });

        return {
            data: workers,
            pagination: {
                page: pageNumber,
                pageSize: pageSize,
                total: await database.prisma.worker.count({
                    where: {
                        groups: { some: { id: id } },
                        show: skipShow ? undefined : true,
                    },
                }),
            },
        };
    };

    const updateGroup = async (id: string, data: ApiUpdateGroup) => {
        const { count } = await database.prisma.group.updateMany({
            where: { id: id },
            data: {
                name: data.name,
                show: data.show,
            },
        });

        if (count === 0) throw new ApiError(404, 'NOT_FOUND');
        logger.warn(`Group updated: ${id}`);
    };

    const updateGroupWorker: (id: string, workerId: string) => Promise<void> = async (
        id: string,
        workerId: string
    ) => {
        const group = await database.prisma.group.findUnique({
            where: { id: id },
        });

        if (!group) throw new ApiError(404, 'NOT_FOUND');

        const worker = await database.prisma.worker.findUnique({
            where: { id: workerId },
        });

        if (!worker) throw new ApiError(404, 'NOT_FOUND', 'Worker not found');

        await database.prisma.group.update({
            where: { id: id },
            data: {
                workers: {
                    connect: { id: workerId },
                },
            },
        });
        logger.success(`Worker ${workerId} added to group ${id}`);
    };

    const deleteGroup: (id: string) => Promise<void> = async (id: string) => {
        const { count } = await database.prisma.group.deleteMany({
            where: { id: id },
        });

        if (count === 0) throw new ApiError(404, 'NOT_FOUND');
        logger.danger(`Group deleted: ${id}`);
    };

    const deleteGroupWorker: (id: string, workerId: string) => Promise<void> = async (
        id: string,
        workerId: string
    ) => {
        const group = await database.prisma.group.findUnique({
            where: { id: id },
        });

        if (!group) throw new ApiError(404, 'NOT_FOUND');

        const worker = await database.prisma.worker.findUnique({
            where: { id: workerId },
        });

        if (!worker) throw new ApiError(404, 'NOT_FOUND', 'Worker not found');

        await database.prisma.group.update({
            where: { id: id },
            data: {
                workers: {
                    disconnect: { id: workerId },
                },
            },
        });
        logger.success(`Worker ${workerId} removed from group ${id}`);
    };

    return {
        createGroup,
        getGroup,
        getGroups,
        getGroupWorkers,
        updateGroup,
        updateGroupWorker,
        deleteGroup,
        deleteGroupWorker,
    };
};

export { groupController };
