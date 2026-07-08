import { Container, Card, Heading, Skeleton, Text, Alert } from '@chakra-ui/react';
import type { ApiGetStatistics } from '@shared/types/api/api-statistics';
import { type FC } from 'react';

const Statistics: FC<{ data?: ApiGetStatistics; loading?: boolean; error?: string }> = ({
    data,
    loading,
    error,
}) => {
    const Tile: FC<{ label: string; value: number | undefined; total?: number | undefined }> = ({
        label,
        value,
        total,
    }) => {
        return (
            <Card.Root w={'100%'}>
                <Card.Header>
                    <Heading size="xl" justifyContent={'center'} textAlign={'center'}>
                        {label}
                    </Heading>
                </Card.Header>
                <Card.Body h={'fit-content'}>
                    <Skeleton loading={!value}>
                        <Heading size="5xl" justifyContent={'center'} textAlign={'center'}>
                            {!value && ' '}
                            {value}
                            {total !== undefined ? (
                                <Text as="span" opacity={0.5} fontSize="3xl">
                                    {' '}
                                    / {total}
                                </Text>
                            ) : (
                                ''
                            )}
                        </Heading>
                    </Skeleton>
                </Card.Body>
            </Card.Root>
        );
    };

    if (error) {
        return (
            <Container display={'grid'} flexDirection={'row'} p={0} gap={4}>
                <Alert.Root variant="subtle" status="error">
                    <Alert.Title>Error</Alert.Title>
                    <Alert.Description>{error}</Alert.Description>
                </Alert.Root>
            </Container>
        );
    }

    return (
        <Container
            display={'grid'}
            flexDirection={'row'}
            p={0}
            gap={4}
            gridTemplateColumns={'repeat(auto-fit, minmax(350px, 1fr))'}
            justifyContent={'space-between'}
        >
            <Tile
                label="Workers"
                value={loading ? undefined : data?.workerCount?.showed}
                total={data?.workerCount?.all}
            />
            <Tile
                label="Groups"
                value={loading ? undefined : data?.groupCount?.showed}
                total={data?.groupCount?.all}
            />
            <Tile
                label="Devices"
                value={loading ? undefined : data?.deviceCount?.used}
                total={data?.deviceCount?.all}
            />
        </Container>
    );
};

export default Statistics;
