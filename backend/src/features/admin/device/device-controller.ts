import { Request, Response } from 'express';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/config/database';
import { ApiAdminGetDeviceResponse, ApiAdminUpdateDeviceRequest } from '@shared/api-admin-device';
import { ApiError } from 'src/types/api-error';
import { $Enums, DeviceType } from '@prisma/client';
import z from 'zod';
import { pagination } from 'src/utils/pagination';

/* Get all devices */

export const getAllDevices = async (req: Request, res: Response) => {
    const { pageNumber, pageSize } = pagination(req);

    const response: ApiResponse<ApiAdminGetDeviceResponse[]> = {
        status: 'SUCCESS',
        data:
            (
                await database.prisma.device.findMany({
                    orderBy: {
                        name: 'asc',
                    },
                    skip: (pageNumber - 1) * pageSize,
                    take: pageSize,
                })
            ).map((device) => ({
                id: device.id,
                type: device.type,
                name: device.name,
            })) ?? [],

        pagination: {
            page: pageNumber,
            total: await database.prisma.device.count(),
            pageSize: pageSize,
        },
    };

    res.status(200).json(response);
};

/* Update device */

const updateDevicesSchema: z.Schema<ApiAdminUpdateDeviceRequest> = z.object({
    type: z.enum($Enums.DeviceType),
});

export const updateDevice = async (req: Request, res: Response) => {
    const deviceId = req.params.deviceId as string;
    const data = updateDevicesSchema.safeParse(req.body);

    if (data.success === false)
        throw new ApiError(400, 'INVALID_ARGS', data.error.issues.map((issue) => issue.message).join(', '));

    const { count } = await database.prisma.device.updateMany({
        where: {
            id: deviceId,
        },
        data: {
            type: data.data.type,
        },
    });

    if (count === 0) throw new ApiError(404, 'NOT_FOUND');

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };

    res.status(200).json(response);
};
