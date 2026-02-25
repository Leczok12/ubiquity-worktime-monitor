import { UbiquityAccessGroup, UbiquityAccessResponse } from '@shared/ubiquity/access';
import { AxiosInstance } from 'axios';
import { PrismaTransaction } from 'src/types/prisma-transaction';

export const syncGroups = async (prisma: PrismaTransaction, axiosInstance: AxiosInstance) => {
    const response =
        await axiosInstance.get<UbiquityAccessResponse<UbiquityAccessGroup[]>>(`/api/v1/developer/user_groups`);

    if (!response.data.data) return;

    // Update or create groups
    for (const group of response.data.data) {
        const existingGroup = await prisma.group.findUnique({
            where: { id: group.id },
        });

        if (existingGroup) {
            const updatedGroup = await prisma.group.update({
                where: { id: group.id },
                data: {
                    name: group.name,
                },
            });
            if (!isDeepStrictEqual(existingGroup, updatedGroup))
                log(`Updated group ${group.name} [${group.id}]`, 'INFO');
        } else {
            await prisma.group.create({
                data: {
                    id: group.id,
                    name: group.name,
                },
            });
            log(`Created group ${group.name} [${group.id}]`, 'SUCCESS');
        }
    }
};
