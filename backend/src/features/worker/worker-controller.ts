import { Request, Response } from 'express';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/config/database';
import { ApiError } from 'src/types/api-error';
import { ApiWorkerResponse } from '@shared/api-worker';
import { roleCheck } from 'src/utils/role-check';
import { pagination } from 'src/utils/pagination';

export const getAllWorkers = async (req: Request, res: Response) => {
    roleCheck(req, 'VIEWER');
    const { pageNumber, pageSize } = pagination(req);

    const response: ApiResponse<ApiWorkerResponse[]> = {
        status: 'SUCCESS',
        data:
            (
                await database.prisma.worker.findMany({
                    skip: (pageNumber - 1) * pageSize,
                    take: pageSize,
                    orderBy: { lastname: 'asc' },
                    where: { sync: true },
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
            total: await database.prisma.worker.count({ where: { sync: true } }),
            pageSize: pageSize,
        },
    };

    res.status(200).json(response);
};

export const findWorkers = async (req: Request, res: Response) => {
    roleCheck(req, 'VIEWER');
    const keyword = req.query.keyword as string | undefined;
    const { pageNumber, pageSize } = pagination(req);

    const response: ApiResponse<ApiWorkerResponse[]> = {
        status: 'SUCCESS',
        data:
            (
                await database.prisma.worker.findMany({
                    skip: (pageNumber - 1) * pageSize,
                    take: pageSize,
                    where: {
                        AND: {
                            sync: true,
                            OR: [
                                { name: { contains: keyword, mode: 'insensitive' } },
                                { lastname: { contains: keyword, mode: 'insensitive' } },
                                { email: { contains: keyword, mode: 'insensitive' } },
                            ],
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
                    AND: {
                        sync: true,
                        OR: [
                            { name: { contains: keyword, mode: 'insensitive' } },
                            { lastname: { contains: keyword, mode: 'insensitive' } },
                            { email: { contains: keyword, mode: 'insensitive' } },
                        ],
                    },
                },
            }),
            pageSize: pageSize,
        },
    };

    res.status(200).json(response);
};

export const getWorkerById = async (req: Request, res: Response) => {
    roleCheck(req, 'WORKER');
    const workerId = req.params.id;

    const worker = await database.prisma.worker.findUnique({ where: { id: workerId.toString() } });

    if (!worker) {
        throw new ApiError(404, 'NOT_FOUND');
    }

    const response: ApiResponse<ApiWorkerResponse> = {
        status: 'SUCCESS',
        data: worker,
    };

    res.status(200).json(response);
};
