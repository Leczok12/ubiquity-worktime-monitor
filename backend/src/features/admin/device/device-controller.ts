import { Request, Response } from 'express';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/config/database';
import { ApiDeviceResponse } from '@shared/api-device';
import { ApiError } from 'src/types/api-error';
import { DeviceType } from '@prisma/client';

export const getAllDevices = async (req: Request, res: Response) => {
    const d = await database.prisma.device.findMany();
    const response: ApiResponse<ApiDeviceResponse[]> = {
        status: 'SUCCESS',
        data: (await database.prisma.device.findMany()) ?? [],
    };

    res.status(200).json(response);
};

export const setDeviceType = async (req: Request, res: Response) => {
    const rawId = req.body?.id;
    const rawType = req.body?.type;

    if (typeof rawId !== 'string') throw new ApiError(400, 'INVALID_ARGS', "Missing or invalid 'id' field");
    if (typeof rawType !== 'string' || !Object.values(DeviceType).includes(rawType as DeviceType))
        throw new ApiError(400, 'INVALID_ARGS', "Missing or invalid 'type' field");

    const device = await database.prisma.device.findFirst({
        where: {
            id: rawId,
        },
    });

    if (!device) {
        throw new ApiError(404, 'NOT_FOUND', 'Device not found');
    }

    const updatedDevice = await database.prisma.device.update({
        where: {
            id: rawId,
        },
        data: {
            type: rawType as DeviceType,
        },
    });

    const response: ApiResponse<ApiDeviceResponse> = {
        status: 'SUCCESS',
        data: updatedDevice,
    };

    res.status(200).json(response);
};
