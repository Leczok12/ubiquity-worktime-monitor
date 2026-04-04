import { Request, Response } from 'express';
import { ApiGetGroupResponse } from '@shared/api-group';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/config/database';

export const getAllGroups = async (req: Request, res: Response) => {
    const response: ApiResponse<ApiGetGroupResponse[]> = {
        status: 'SUCCESS',
        data:
            (
                await database.prisma.group.findMany({
                    where: { sync: true },
                    orderBy: { name: 'asc' },
                })
            ).map((group) => ({
                id: group.id,
                name: group.name,
            })) ?? [],
    };

    res.status(200).json(response);
};
