import { Request, Response } from 'express';
import { ApiGroupResponse } from '@shared/api-group';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/config/database';

export const getAllGroups = async (req: Request, res: Response) => {
    const response: ApiResponse<ApiGroupResponse[]> = {
        status: 'SUCCESS',
        data: (await database.prisma.group.findMany({})) ?? [],
    };

    res.status(200).json(response);
};
