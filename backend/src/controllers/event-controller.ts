import { Device } from '@prisma/client';
import { ApiCreateEvent, ApiGetEvent, ApiGetEventExtended, ApiUpdateEvent } from '@shared/types/api/api-event';
import { logger } from '@shared/utils/logger';
import { database } from '@src/config/database';
import { ApiError } from '@src/types/api-error';
import { PaginationWrapper } from '@src/types/pagination-warpper';

const eventController = () => {
    const createEvent: (data: ApiCreateEvent) => Promise<void> = async (data: ApiCreateEvent) => {
        if (data.id) {
            const existingEvent = await database.prisma.event.findUnique({
                where: { id: data.id },
            });
            if (existingEvent) throw new ApiError(400, 'INVALID_ARGS', 'Event with the same ID already exists');
        }

        await database.prisma.event.create({
            data: {
                id: data.id,
                deviceId: data.deviceId,
                workerId: data.workerId,
                date: data.date,
            },
        });
        logger.success(`Event created: ${data.id}`);
    };

    // const getDevice: (id: string) => Promise<Device> = async (id: string) => {
    //     const device = await database.prisma.device.findUnique({
    //         where: { id: id },
    //     });

    //     if (!device) throw new ApiError(404, 'NOT_FOUND', 'Device not found');

    //     return device;
    // };

    // const getDevices: (pageSize: number, pageNumber: number) => Promise<PaginationWrapper<Device[]>> = async (
    //     pageSize: number,
    //     pageNumber: number
    // ) => {
    //     const devices = await database.prisma.device.findMany({
    //         take: pageSize,
    //         skip: (pageNumber - 1) * pageSize,
    //         orderBy: [{ name: 'asc' }],
    //     });

    //     return {
    //         data: devices,
    //         pagination: {
    //             page: pageNumber,
    //             pageSize: pageSize,
    //             total: await database.prisma.device.count(),
    //         },
    //     };
    // };

    const updateEvent: (id: string, data: ApiUpdateEvent) => Promise<void> = async (
        id: string,
        data: ApiUpdateEvent
    ) => {
        const existingEvent = await database.prisma.event.findUnique({
            where: { id: id },
        });

        if (!existingEvent) throw new ApiError(404, 'NOT_FOUND');

        await database.prisma.event.update({
            where: { id: id },
            data: {
                deviceId: data.deviceId,
                workerId: data.workerId,
                date: data.date,
            },
        });
        logger.warn(`Event updated: ${existingEvent.id}`);
    };

    const deleteEvent: (id: string) => Promise<void> = async (id: string) => {
        const existingEvent = await database.prisma.event.findUnique({
            where: { id: id },
        });

        if (!existingEvent) throw new ApiError(404, 'NOT_FOUND');

        await database.prisma.event.delete({
            where: { id: id },
        });

        logger.danger(`Event deleted: ${existingEvent.id}`);
    };

    return { createEvent, updateEvent, deleteEvent };
};

export { eventController };
