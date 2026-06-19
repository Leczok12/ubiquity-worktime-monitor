import { Prisma, Worker } from '@prisma/client';
import { ApiCreateWorker, ApiGetWorker, ApiUpdateWorker } from '@shared/types/api/api-worker';
import { database } from '@src/config/database';
import { ApiError } from '@src/types/api-error';
import { PaginationWrapper } from '@src/types/pagination-warpper';
import { skip } from 'node:test';

const workerController = () => {
    const createWorker: (data: ApiCreateWorker) => Promise<void> = async (data: ApiCreateWorker) => {
        if (data.id) {
            const existingWorker = await database.prisma.worker.findUnique({
                where: { id: data.id },
            });

            if (existingWorker) throw new ApiError(400, 'INVALID_ARGS', 'Worker with this ID already exists');
        }

        await database.prisma.worker.create({
            data: {
                id: data.id,
                name: data.name,
                lastname: data.lastname,
                email: data.email,
                active: data.active ?? true,
                sync: data.sync ?? true,
            },
        });
    };

    const getWorker: (id: string, skipSync?: boolean) => Promise<Worker> = async (id: string, skipSync?: boolean) => {
        const worker = await database.prisma.worker.findUnique({
            where: { id: id, sync: skipSync ? undefined : true },
        });

        if (!worker) throw new ApiError(404, 'NOT_FOUND');

        return worker;
    };

    const getWorkers: (
        pageSize: number,
        pageNumber: number,
        groupId?: string,
        skipSync?: boolean
    ) => Promise<PaginationWrapper<Worker[]>> = async (pageSize, pageNumber, groupId, skipSync) => {
        if (groupId) {
            const group = await database.prisma.group.findUnique({
                where: { id: groupId, sync: skipSync ? undefined : true },
            });
            if (!group) throw new ApiError(404, 'NOT_FOUND', 'Group not found');
        }

        const workerWhere = groupId
            ? {
                  AND: [{ groups: { some: { id: groupId } } }, { sync: skipSync ? undefined : true }],
              }
            : {
                  sync: skipSync ? undefined : true,
              };

        const workers = await database.prisma.worker.findMany({
            take: pageSize,
            skip: (pageNumber - 1) * pageSize,
            where: workerWhere,
            orderBy: [{ lastname: 'asc' }, { name: 'asc' }],
        });

        return {
            data: workers,
            pagination: {
                page: pageNumber,
                pageSize: pageSize,
                total: await database.prisma.worker.count({
                    where: workerWhere,
                }),
            },
        };
    };

    const findWorkers: (
        pageSize: number,
        pageNumber: number,
        keyword: string,
        skipSync?: boolean
    ) => Promise<PaginationWrapper<Worker[]>> = async (pageSize, pageNumber, keyword, skipSync) => {
        const workerWhere: Prisma.WorkerWhereInput = {
            AND: {
                sync: skipSync ? undefined : true,
                OR: [
                    { name: { contains: keyword, mode: 'insensitive' } },
                    { lastname: { contains: keyword, mode: 'insensitive' } },
                    { email: { contains: keyword, mode: 'insensitive' } },
                ],
            },
        };

        const workers = await database.prisma.worker.findMany({
            take: pageSize,
            skip: (pageNumber - 1) * pageSize,
            where: workerWhere,
            orderBy: [{ lastname: 'asc' }, { name: 'asc' }],
        });

        return {
            data: workers,
            pagination: {
                page: pageNumber,
                pageSize: pageSize,
                total: await database.prisma.worker.count({
                    where: workerWhere,
                }),
            },
        };
    };

    const updateWorker = async (id: string, data: ApiUpdateWorker) => {
        const { count } = await database.prisma.worker.updateMany({
            where: { id: id },
            data: {
                name: data.name,
                lastname: data.lastname,
                email: data.email,
                active: data.active,
                sync: data.sync,
            },
        });

        if (count === 0) throw new ApiError(404, 'NOT_FOUND');
    };

    const deleteWorker: (id: string) => Promise<void> = async (id: string) => {
        const { count } = await database.prisma.worker.deleteMany({
            where: { id: id },
        });

        if (count === 0) throw new ApiError(404, 'NOT_FOUND');
    };

    return { createWorker, getWorker, getWorkers, findWorkers, updateWorker, deleteWorker };
};

export { workerController };
