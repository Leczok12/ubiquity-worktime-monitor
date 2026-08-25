import { Box, Card, Heading, Skeleton } from '@chakra-ui/react';
import { getApiWorker } from '@src/api/api-worker';
import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';

const WorkerHero: FC<{ workerId: string }> = ({ workerId }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['worker', workerId],
        queryFn: async () => {
            return getApiWorker(workerId);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });

    if (error) {
        if (error.message === 'NOT_FOUND') {
            throw new Error('Worker not found');
        }
        throw new Error(error.message || 'An error occurred while fetching worker data.');
    }

    return (
        <Card.Root w={'100%'}>
            <Card.Header
                p={5}
                m={0}
                display={'grid'}
                gridTemplateColumns={'1fr auto'}
                md={{ gridTemplateColumns: '50% auto' }}
                flexDirection={'row'}
                gap={4}
                justifyContent={'space-between'}
                alignItems={'center'}
            >
                <Box display={'flex'} flexDirection={'column'} gap={2}>
                    <Skeleton loading={isLoading}>
                        <Heading size="4xl" textAlign={'left'} m={0} p={0}>
                            {isLoading
                                ? 'Loading...'
                                : data?.data?.name + ' ' + data?.data?.lastname}
                        </Heading>
                    </Skeleton>
                    <Skeleton loading={isLoading}>
                        <Heading size="lg" textAlign={'left'} m={0} p={0} opacity={0.5}>
                            {isLoading
                                ? 'Loading...'
                                : data?.data?.email
                                  ? data.data.email
                                  : '---@---.--'}
                        </Heading>
                    </Skeleton>
                </Box>
                <Skeleton loading={isLoading}>
                    <Heading
                        size="xl"
                        textAlign={'left'}
                        color={data?.data?.active ? 'fg.success' : 'fg.error'}
                    >
                        {isLoading ? 'Loading...' : data?.data?.active ? 'Active' : 'Inactive'}
                    </Heading>
                </Skeleton>
            </Card.Header>
        </Card.Root>
    );
};

export default WorkerHero;
