import { Request, Response } from 'express';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/services/database';
import { ApiDeviceResponse } from '@shared/api-device';

export const getAllDevices = async (req: Request, res: Response) => {
    const d = await database.prisma.device.findMany();
    const response: ApiResponse<ApiDeviceResponse[]> = {
        status: 'SUCCESS',
        data: (await database.prisma.device.findMany()) ?? [],
    };

    res.status(200).json(response);
};
