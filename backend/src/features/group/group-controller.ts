import { Request, Response } from 'express';
import { ApiGroupResponse } from '@shared/api-group';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/config/database';
import { ApiWorkerResponse } from '@shared/api-worker';
import { ApiError } from 'src/types/api-error';
import { pagination } from 'src/utils/pagination';

export const getAllGroups = async (req: Request, res: Response) => {
    const response: ApiResponse<ApiGroupResponse[]> = {
        status: 'SUCCESS',
        data:
            (await database.prisma.group.findMany()).map((group) => ({
                id: group.id,
                name: group.name,
                sync: true, // TOOD: add sync to group model
            })) ?? [],
    };

    res.status(200).json(response);
};

export const getAllWorkersInGroup = async (req: Request, res: Response) => {
    const groupId = req.params.id;

    if (!(await database.prisma.group.findUnique({ where: { id: groupId.toString() } }))) {
        throw new ApiError(404, 'NOT_FOUND');
    }

    const { pageNumber, pageSize } = pagination(req);

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
