import { UbiquitiAccessResponse, UbiquitiAccessDevice } from './ubiquiti-access-api-types';
import { AxiosInstance } from 'axios';
import { Logger } from '@src/utils/logger';
import { database } from '@src/config/database';

export const syncDevices = async (axiosInstance: AxiosInstance, logger: Logger) => {
    logger.info('Starting devices sync');

    var deviceCount = 0;
    var errorCount = 0;

    try {
        const response = await axiosInstance.get<UbiquitiAccessResponse<UbiquitiAccessDevice[][]>>(
            `/api/v1/developer/devices?refresh=true`
        );

        if (!response.data || !response.data.data) {
            throw new Error('Invalid response from Ubiquiti Access API');
        }

        const currentDevices = response.data.data
            .filter(
                (d) =>
                    d[0].capabilities.includes('is_reader') || d[0].capabilities.includes('is_hub')
            )
            .map((d) => d[0]);
        const existingDevices = await database.prisma.device.findMany();

        for (const device of currentDevices) {
            deviceCount++;
            logger.verbose(
                `[${deviceCount}/${currentDevices.length}] Syncing device {${device.id}}`
            );

            try {
                if (
                    existingDevices.find((d) => d.id === device.id) &&
                    existingDevices.find((d) => d.id === device.id)?.name !== device.alias
                ) {
                    logger.warn(
                        `Updating device {${device.id}} name from ${existingDevices.find((d) => d.id === device.id)?.name} to ${device.alias}`
                    );
                    await database.prisma.device.update({
                        where: { id: device.id },
                        data: {
                            name: device.alias ?? '',
                        },
                    });
                } else if (!existingDevices.find((d) => d.id === device.id)) {
                    await database.prisma.device.create({
                        data: {
                            id: device.id,
                            name: device.alias ?? '',
                        },
                    });
                    logger.success(`Created device {${device.id}} - ${device.alias}`);
                }
            } catch (error) {
                logger.error(
                    `Failed to sync device {${device.id}} - ${device.alias}: ${error instanceof Error ? error.message : error}`
                );
                errorCount++;
            }
        }
        for (const existingDevice of existingDevices) {
            try {
                if (!currentDevices.find((d) => d.id === existingDevice.id)) {
                    await database.prisma.device.delete({
                        where: { id: existingDevice.id },
                    });
                    logger.danger(`Deleted device {${existingDevice.id}} - ${existingDevice.name}`);
                }
            } catch (error) {
                logger.error(
                    `Failed to delete device {${existingDevice.id}} - ${existingDevice.name}: ${error instanceof Error ? error.message : error}`
                );
                errorCount++;
            }
        }
    } catch (error) {
        logger.error(`Devices sync failed: ${error instanceof Error ? error.message : error}`);
        errorCount++;
    }

    logger.success('Finished devices sync');
    return { deviceCount, errorCount };
};
