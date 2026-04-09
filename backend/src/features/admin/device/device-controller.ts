import { Request, Response } from 'express';
import { ApiResponse } from '@shared/api-response';
import { database } from 'src/config/database';
import { ApiAdminUpdateDeviceRequest } from '@shared/api-admin-device';
import { ApiError } from 'src/types/api-error';
import { $Enums, DeviceType } from '@prisma/client';
import z from 'zod';

export const getAllDevices = async (req: Request, res: Response) => {
    const response: ApiResponse<ApiAdminUpdateDeviceRequest[]> = {
        status: 'SUCCESS',
        data: (await database.prisma.device.findMany()) ?? [],
    };

    res.status(200).json(response);
};

/* Update device */

const updateDevicesSchema: z.Schema<ApiAdminUpdateDeviceRequest[]> = z.array(
    z.object({
        id: z.string(),
        type: z.enum($Enums.DeviceType),
    })
);

export const updateDevices = async (req: Request, res: Response) => {
    console.log('Updating devices for worker', req.body);
    const data = updateDevicesSchema.safeParse(req.body.data);

    if (data.success === false)
        throw new ApiError(400, 'INVALID_ARGS', data.error.issues.map((issue) => issue.message).join(', '));

    database.prisma.$transaction(async (prisma) => {
        for (const device of data.data) {
            const existingDevice = prisma.device.findUnique({
                where: {
                    id: device.id,
                },
            });

            if (!existingDevice) throw new ApiError(404, 'NOT_FOUND', `Device with id ${device.id} not found`);

            await prisma.device.update({
                where: {
                    id: device.id,
                },
                data: {
                    type: device.type,
                },
            });
        }
    });

    const response: ApiResponse<undefined> = {
        status: 'SUCCESS',
    };

    res.status(200).json(response);
};
