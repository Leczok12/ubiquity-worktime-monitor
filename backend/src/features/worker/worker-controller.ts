import { Request, Response } from 'express';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/config/database';
import { ApiError } from 'src/types/api-error';
import { ApiWorkerResponse } from '@shared/api-worker';

export const getAllWorkers = async (req: Request, res: Response) => {
    const pageNumber = parseInt((req.query.pageNumber as string | undefined) ?? '1');
    const pageSize = parseInt((req.query.pageSize as string | undefined) ?? '9999');

    if (pageNumber < 1 || pageSize < 1) {
        throw new ApiError(400, 'INVALID_ARGS');
    }

    const response: ApiResponse<ApiWorkerResponse[]> = {
        status: 'SUCCESS',
        data:
            (
                await database.prisma.worker.findMany({
                    skip: (pageNumber - 1) * pageSize,
                    take: pageSize,
                    orderBy: { lastname: 'asc' },
                })
            ).map((worker) => ({
                id: worker.id,
                name: worker.name,
                lastname: worker.lastname,
                email: worker.email,
                active: worker.active,
                sync: worker.sync,
            })) ?? [],
        pagination: {
            page: pageNumber,
            total: await database.prisma.worker.count(),
            pageSize: pageSize,
        },
    };

    res.status(200).json(response);
};

export const findWorkers = async (req: Request, res: Response) => {
    const keyword = req.query.keyword as string | undefined;
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 9999;

    if (keyword === undefined || pageNumber < 1 || pageSize < 1) {
        throw new ApiError(400, 'INVALID_ARGS');
    }

    const response: ApiResponse<ApiWorkerResponse[]> = {
        status: 'SUCCESS',
        data:
            (
                await database.prisma.worker.findMany({
                    skip: (pageNumber - 1) * pageSize,
                    take: pageSize,
                    where: {
                        OR: [
                            { name: { contains: keyword, mode: 'insensitive' } },
                            { lastname: { contains: keyword, mode: 'insensitive' } },
                            { email: { contains: keyword, mode: 'insensitive' } },
                        ],
                    },
                    orderBy: { lastname: 'asc' },
                })
            ).map((worker) => ({
                id: worker.id,
                name: worker.name,
                lastname: worker.lastname,
                email: worker.email,
                active: worker.active,
                sync: worker.sync,
            })) ?? [],
        pagination: {
            page: pageNumber,
            total: await database.prisma.worker.count({
                where: {
                    OR: [
                        { name: { contains: keyword, mode: 'insensitive' } },
                        { lastname: { contains: keyword, mode: 'insensitive' } },
                        { email: { contains: keyword, mode: 'insensitive' } },
                    ],
                },
            }),
            pageSize: pageSize,
        },
    };

    res.status(200).json(response);
};

export const getAllWorkersInGroup = async (req: Request, res: Response) => {
    const groupId = req.params.id;
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 9999;

    if (!groupId || pageNumber < 1 || pageSize < 1) {
        throw new ApiError(400, 'INVALID_ARGS');
    }
    if (!(await database.prisma.group.findUnique({ where: { id: groupId.toString() } }))) {
        throw new ApiError(404, 'NOT_FOUND');
    }

    const response: ApiResponse<ApiWorkerResponse[]> = {
        status: 'SUCCESS',
        data:
            (
                await database.prisma.worker.findMany({
                    skip: (pageNumber - 1) * pageSize,
                    take: pageSize,
                    where: {
                        groups: {
                            some: { id: groupId.toString() },
                        },
                    },
                    orderBy: { lastname: 'asc' },
                })
            ).map((worker) => ({
                id: worker.id,
                name: worker.name,
                lastname: worker.lastname,
                email: worker.email,
                active: worker.active,
                sync: worker.sync,
            })) ?? [],
        pagination: {
            page: pageNumber,
            total: await database.prisma.worker.count({
                where: {
                    groups: {
                        some: { id: groupId.toString() },
                    },
                },
            }),
            pageSize: pageSize,
        },
    };

    res.status(200).json(response);
};
