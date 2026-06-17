import { Worker } from '@prisma/client';
import { ApiCreateWorker, ApiUpdateWorker } from '@shared/types/api/api-worker';
import { database } from '@src/config/database';
import { ApiError } from '@src/types/api-error';

const workerController = () => {
    const createWorker: (data: ApiCreateWorker) => Promise<void> = async (data: ApiCreateWorker) => {
        if (data.id) {
            const existingWorker = await database.prisma.worker.findUnique({
                where: { id: data.id },
            });

            if (existingWorker) throw new ApiError(400, 'Worker with this ID already exists');
        }

        const worker = await database.prisma.worker.create({
            data: {
                id: data.id,
                name: data.name,
                lastname: data.lastname,
                email: data.email,
                active: data.active ?? true,
                sync: data.sync ?? true,
            },
        });
    };

    const getWorker: (id: string) => Promise<Worker> = async (id: string) => {
        const worker = await database.prisma.worker.findUnique({
            where: { id: id },
        });

        if (!worker) throw new ApiError(404, 'NOT_FOUND');

        return worker;
    };

    const updateWorker = async (id: string, data: ApiUpdateWorker) => {
        const { count } = await database.prisma.worker.updateMany({
            where: { id: id },
            data: {
                name: data.name,
                lastname: data.lastname,
                email: data.email,
                active: data.active,
                sync: data.sync,
            },
        });

        if (count === 0) throw new ApiError(404, 'NOT_FOUND');
    };

    const deleteWorker: (id: string) => Promise<void> = async (id: string) => {
        const { count } = await database.prisma.worker.deleteMany({
            where: { id: id },
        });

        if (count === 0) throw new ApiError(404, 'NOT_FOUND');
    };

    return { createWorker, getWorker, updateWorker, deleteWorker };
};

export { workerController };
