import { UbiquitiAccessResponse, UbiquitiAccessDevice } from './ubiquiti-access-api-types';
import { AxiosInstance } from 'axios';
import { PrismaTransaction } from 'src/types/prisma-transaction';
import { logger } from '../logger';

export const syncDevices = async (prisma: PrismaTransaction, axiosInstance: AxiosInstance) => {
    logger.info('Starting devices sync with Ubiquiti Access API');
    const response = await axiosInstance.get<UbiquitiAccessResponse<UbiquitiAccessDevice[][]>>(
        `/api/v1/developer/devices?refresh=true`
    );

    if (!response.data || !response.data.data) {
        throw new Error('Invalid response from Ubiquiti Access API');
    }

    for (const rDevice of response.data.data) {
        const device = rDevice[0];
        if (!device.id) {
            throw new Error(`Invalid response from Ubiquiti Access API`);
        }

        const existingDevice = await prisma.device.findUnique({
            where: { id: device.id },
        });

        if (!existingDevice) {
            await prisma.device.create({
                data: {
                    id: device.id,
                    name: device.alias,
                },
            });
            logger.success(`Created device ${device.alias}`);
        } else if (existingDevice.name !== device.alias) {
            await prisma.device.update({
                where: { id: device.id },
                data: {
                    name: device.alias,
                },
            });
            logger.warn(`Updated device ${device.alias}`);
        }
    }

    const removedDevices = await prisma.device.findMany({
        where: {
            NOT: {
                id: {
                    in: response.data.data.map((u) => u[0].id),
                },
            },
        },
    });

    for (const removedDevice of removedDevices) {
        await prisma.device.delete({
            where: { id: removedDevice.id },
        });
        logger.danger(`Deleted device ${removedDevice.name}`);
    }

    logger.success('Finished device sync with Ubiquiti Access API');
};
