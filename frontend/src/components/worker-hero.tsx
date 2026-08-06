import { Box, Card, Heading, Skeleton } from '@chakra-ui/react';
import type { ApiGetWorker } from '@shared/types/api/api-worker';
import type { FC } from 'react';

const WorkerHero: FC<{ data?: ApiGetWorker; isLoading?: boolean }> = ({ data, isLoading }) => {
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
                            {isLoading ? 'Loading...' : data?.name + ' ' + data?.lastname}
                        </Heading>
                    </Skeleton>
                    <Skeleton loading={isLoading}>
                        <Heading size="lg" textAlign={'left'} m={0} p={0} opacity={0.5}>
                            {isLoading ? 'Loading...' : data?.email ? data.email : '---@---.--'}
                        </Heading>
                    </Skeleton>
                </Box>
                <Skeleton loading={isLoading}>
                    <Heading
                        size="xl"
                        textAlign={'left'}
                        color={data?.active ? 'fg.success' : 'fg.error'}
                    >
                        {isLoading ? 'Loading...' : data?.active ? 'Active' : 'Inactive'}
                    </Heading>
                </Skeleton>
            </Card.Header>
        </Card.Root>
    );
};

export default WorkerHero;
