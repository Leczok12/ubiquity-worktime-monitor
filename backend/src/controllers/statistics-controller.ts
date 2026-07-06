import { Group, Worker } from '@prisma/client';
import { ApiCreateGroup, ApiUpdateGroup } from '@shared/types/api/api-group';
import { ApiGetStatistics } from '@shared/types/api/api-statistics';
import { logger } from '@shared/utils/logger';
import { database } from '@src/config/database';
import { ApiError } from '@src/types/api-error';
import { PaginationWrapper } from '@src/types/pagination-warpper';

const statisticsController = () => {
    const getStatistics: (extended?: boolean) => Promise<ApiGetStatistics> = async (extended) => {
        return {
            workerCount: {
                all: extended ? await database.prisma.worker.count() : undefined,
                showed: await database.prisma.worker.count({
                    where: {
                        show: true,
                    },
                }),
            },
            groupCount: {
                all: extended ? await database.prisma.group.count() : undefined,
                showed: await database.prisma.group.count({
                    where: {
                        show: true,
                    },
                }),
            },
            deviceCount: {
                all: extended ? await database.prisma.device.count() : undefined,
                used: await database.prisma.device.count({
                    where: {
                        type: {
                            not: 'UNUSED',
                        },
                    },
                }),
            },
        };
    };

    return { getStatistics };
};

export { statisticsController };
