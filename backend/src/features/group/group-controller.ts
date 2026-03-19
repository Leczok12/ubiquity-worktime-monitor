import { Request, Response } from 'express';
import { ApiGroupResponse } from '@shared/api-group';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/config/database';
import { ApiWorkerResponse } from '@shared/api-worker';
import { ApiError } from 'src/types/api-error';

export const getAllGroups = async (req: Request, res: Response) => {
    const response: ApiResponse<ApiGroupResponse[]> = {
        status: 'SUCCESS',
        data: (await database.prisma.group.findMany({})) ?? [],
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
                        AND: [
                            { sync: true },
                            {
                                groups: {
                                    some: { id: groupId.toString() },
                                },
                            },
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
                    AND: [
                        { sync: true },
                        {
                            groups: {
                                some: { id: groupId.toString() },
                            },
                        },
                    ],
                },
            }),
            pageSize: pageSize,
        },
    };

    res.status(200).json(response);
};
