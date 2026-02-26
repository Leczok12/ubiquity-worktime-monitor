import { UbiquityAccessResponse, UbiquityAccessUser } from '@shared/ubiquity/access';
import { AxiosInstance } from 'axios';
import { isDeepStrictEqual } from 'node:util';
import { PrismaTransaction } from 'src/types/prisma-transaction';
import { log } from 'src/utils/log';

export const syncWorkers = async (prisma: PrismaTransaction, axiosInstance: AxiosInstance) => {
    const response = await axiosInstance.get<UbiquityAccessResponse<UbiquityAccessUser[]>>(`/api/v1/developer/users`);

    if (response.data.data) {
        for (const user of response.data.data) {
            const worker = await prisma.worker.findUnique({
                where: { id: user.id },
            });

            if (worker) {
                const updatedWorker = await prisma.worker.update({
                    where: { id: user.id },
                    data: {
                        name: user.first_name,
                        lastname: user.last_name,
                        email: user.user_email == '' ? null : user.user_email,
                        active: user.status === 'ACTIVE' ? true : false,
                    },
                });
                if (!isDeepStrictEqual(worker, updatedWorker))
                    log(`Updated worker ${user.first_name} ${user.last_name}`, 'INFO');
            } else {
                await prisma.worker.create({
                    data: {
                        id: user.id,
                        name: user.first_name,
                        email: user.user_email == '' ? null : user.user_email,
                        active: user.status === 'ACTIVE' ? true : false,
                        lastname: user.last_name,
                    },
                });
                log(`Created worker ${user.first_name} ${user.last_name}`, 'INFO');
            }
        }
    }
};
