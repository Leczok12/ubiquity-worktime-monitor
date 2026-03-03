import { Request, Response } from 'express';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/services/database';
import { ApiError } from 'src/types/api-error';
import { ApiWorkerResponse } from '@shared/api-worker';

export const getAllWorkersInGroup = async (req: Request, res: Response) => {
    console.log('getAllWorkersInGroup called with groupId:', req.params.id);
    const groupId = req.params.id;

    if (!groupId) {
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
                    where: {
                        groups: {
                            some: { id: groupId.toString() },
                        },
                    },
                })
            ).map((worker) => ({
                id: worker.id,
                name: worker.name,
                lastname: worker.lastname,
                email: worker.email,
                active: worker.active,
            })) ?? [],
    };

    res.status(200).json(response);
};
