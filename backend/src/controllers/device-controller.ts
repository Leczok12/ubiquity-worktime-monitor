import { Device } from '@prisma/client';
import { ApiCreateDevice, ApiUpdateDevice } from '@shared/types/api/api-device';
import { logger } from '@shared/utils/logger';
import { database } from '@src/config/database';
import { ApiError } from '@src/types/api-error';
import { PaginationWrapper } from '@src/types/pagination-warpper';

const deviceController = () => {
    const createDevice: (data: ApiCreateDevice) => Promise<void> = async (
        data: ApiCreateDevice
    ) => {
        if (data.id) {
            const existingDevice = await database.prisma.device.findUnique({
                where: { id: data.id },
            });
            if (existingDevice)
                throw new ApiError(400, 'INVALID_ARGS', 'Device with the same ID already exists');
        }

        await database.prisma.device.create({
            data: {
                id: data.id,
                name: data.name,
                type: data.type,
            },
        });
        logger.success(`Device created: ${data.name}`);
    };

    const getDevice: (id: string) => Promise<Device> = async (id: string) => {
        const device = await database.prisma.device.findUnique({
            where: { id: id },
        });

        if (!device) throw new ApiError(404, 'NOT_FOUND', 'Device not found');

        return device;
    };

    const getDevices: (
        pageSize: number,
        pageNumber: number
    ) => Promise<PaginationWrapper<Device[]>> = async (pageSize: number, pageNumber: number) => {
        const devices = await database.prisma.device.findMany({
            take: pageSize,
            skip: (pageNumber - 1) * pageSize,
            orderBy: [{ name: 'asc' }],
        });

        return {
            data: devices,
            pagination: {
                page: pageNumber,
                pageSize: pageSize,
                total: await database.prisma.device.count(),
            },
        };
    };

    const updateDevice: (id: string, data: ApiUpdateDevice) => Promise<void> = async (
        id: string,
        data: ApiUpdateDevice
    ) => {
        const existingDevice = await database.prisma.device.findUnique({
            where: { id: id },
        });

        if (!existingDevice) throw new ApiError(404, 'NOT_FOUND');

        await database.prisma.device.update({
            where: { id: id },
            data: {
                name: data.name,
                type: data.type,
            },
        });
        logger.warn(`Device updated: ${existingDevice.name}`);
    };

    const deleteDevice: (id: string) => Promise<void> = async (id: string) => {
        const existingDevice = await database.prisma.device.findUnique({
            where: { id: id },
        });

        if (!existingDevice) throw new ApiError(404, 'NOT_FOUND');

        await database.prisma.device.delete({
            where: { id: id },
        });

        logger.danger(`Device deleted: ${existingDevice.name}`);
    };

    return { createDevice, getDevice, getDevices, updateDevice, deleteDevice };
};

export { deviceController };
