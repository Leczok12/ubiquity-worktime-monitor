import { Request, Response } from 'express';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/config/database';
import { ApiError } from 'src/types/api-error';
import { ApiGetWorkerResponse } from '@shared/api-worker';
import { roleCheck } from 'src/utils/role-check';
import { pagination } from 'src/utils/pagination';
import { group } from 'node:console';
import { Prisma } from '@prisma/client';

export const getAllWorkers = async (req: Request, res: Response) => {
    const groupId = req.params.groupId as string | undefined;
    const { pageNumber, pageSize } = pagination(req);

    const workerWhere: Prisma.WorkerWhereInput = !groupId
        ? { sync: true }
        : {
              AND: [
                  { sync: true },
                  {
                      groups: {
                          some: { id: groupId },
                      },
                  },
              ],
          };

    const response: ApiResponse<ApiGetWorkerResponse[]> = {
        status: 'SUCCESS',
        data:
            (
                await database.prisma.worker.findMany({
                    skip: (pageNumber - 1) * pageSize,
                    take: pageSize,
                    orderBy: [{ lastname: 'asc' }, { name: 'asc' }],
                    where: workerWhere,
                })
            ).map((worker) => ({
                id: worker.id,
                name: worker.name,
                lastname: worker.lastname,
                email: worker.email,
                active: worker.active,
            })) ?? [],
        pagination: {
            page: pageNumber,
            total: await database.prisma.worker.count({ where: workerWhere }),
            pageSize: pageSize,
        },
    };

    res.status(200).json(response);
};

export const getFindWorkers = async (req: Request, res: Response) => {
    const keyword = req.query.keyword as string | undefined;

    if (!keyword) throw new ApiError(400, 'INVALID_ARGS');

    const { pageNumber, pageSize } = pagination(req);

    const workerWhere: Prisma.WorkerWhereInput = {
        AND: {
            sync: true,
            OR: [
                { name: { contains: keyword, mode: 'insensitive' } },
                { lastname: { contains: keyword, mode: 'insensitive' } },
                { email: { contains: keyword, mode: 'insensitive' } },
            ],
        },
    };

    const response: ApiResponse<ApiGetWorkerResponse[]> = {
        status: 'SUCCESS',
        data:
            (
                await database.prisma.worker.findMany({
                    skip: (pageNumber - 1) * pageSize,
                    take: pageSize,
                    where: workerWhere,
                    orderBy: [{ lastname: 'asc' }, { name: 'asc' }],
                })
            ).map((worker) => ({
                id: worker.id,
                name: worker.name,
                lastname: worker.lastname,
                email: worker.email,
                active: worker.active,
            })) ?? [],
        pagination: {
            page: pageNumber,
            total: await database.prisma.worker.count({
                where: workerWhere,
            }),
            pageSize: pageSize,
        },
    };

    res.status(200).json(response);
};

export const getWorker = async (req: Request, res: Response) => {
    const rawWorkerId = req.params.workerId as string;
    const workerId = rawWorkerId === undefined ? req.user?.id : rawWorkerId;

    const worker = await database.prisma.worker.findUnique({
        where: { id: workerId, sync: true },
    });

    if (!worker) throw new ApiError(404, 'NOT_FOUND');

    const response: ApiResponse<ApiGetWorkerResponse> = {
        status: 'SUCCESS',
        data: {
            id: worker.id,
            name: worker.name,
            lastname: worker.lastname,
            email: worker.email,
            active: worker.active,
        },
    };

    res.status(200).json(response);
};
