import { type FC } from 'react';
import { useBreakpointValue, Card, Text, Button } from '@chakra-ui/react';
import Alert from './alert';
import MultipleLineSkeleton from './multiple-line-skeleton';
import { userRole, type ApiGetUser, type ApiUpdateUser } from '@shared/types/api/api-user';
import Select from './select';

const BreakPoints = {
    base: 'small',
    sm: 'small',
    md: 'small',
    lg: 'small',
    xl: 'normal',
};

export const AdminUserTable: FC<{
    loading?: boolean;
    error?: string;
    data?: ApiGetUser[];
    disabled?: boolean;
    onEdit: (id: string, data: ApiUpdateUser) => void;
}> = ({ loading, error, data, disabled, onEdit }) => {
    const currentBrakePoint = useBreakpointValue(BreakPoints, { ssr: false });

    return (
        <Card.Root>
            <Card.Body display="flex" flexDirection="column" gap={3}>
                {(() => {
                    if (error) {
                        return <Alert status="error" title="Error" description={error} />;
                    }
                    if (loading) {
                        return <MultipleLineSkeleton lines={3} />;
                    }
                    if (data?.length === 0 || data === undefined) {
                        return <Alert status="info" title="Info" description="No workers found" />;
                    }

                    return (
                        <>
                            {currentBrakePoint === 'normal' && (
                                <Card.Root>
                                    <Card.Body
                                        pt={2}
                                        pb={2}
                                        display="grid"
                                        gridTemplateColumns={'1fr 1fr 1fr 1fr 1fr 1fr 1fr'}
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                        textAlign={'center'}
                                    >
                                        <strong>ID</strong>
                                        <strong>Name</strong>
                                        <strong>Email</strong>
                                        <strong>Last Login</strong>
                                        <strong>Last Activity</strong>
                                        <strong>Role</strong>
                                    </Card.Body>
                                </Card.Root>
                            )}
                            {data?.map((user) => (
                                <AdminUserTableRow
                                    key={user.id}
                                    data={user}
                                    isSmall={currentBrakePoint === 'small'}
                                    disabled={disabled}
                                    onEdit={onEdit}
                                />
                            ))}
                        </>
                    );
                })()}
            </Card.Body>
        </Card.Root>
    );
};

const AdminUserTableRow: FC<{
    data: ApiGetUser;
    isSmall?: boolean;
    disabled?: boolean;
    onEdit: (id: string, data: ApiUpdateUser) => void;
}> = ({ data, isSmall = false, disabled, onEdit }) => {
    return (
        <Card.Root _hover={{ bg: 'bg.muted' }} transition="background-color 0.1s ease-in-out">
            <Card.Body
                display="grid"
                pb={2}
                pt={2}
                gridTemplateColumns={isSmall ? '1fr' : '1fr 1fr 1fr 1fr 1fr 1fr 1fr'}
                gap={isSmall ? 2 : 0}
                justifyContent="space-evenly"
                alignItems="center"
                textAlign={'center'}
            >
                <Text truncate>{data.id}</Text>
                <Text truncate>
                    {data.name} {data.lastname}
                </Text>
                <Text truncate>{!data.email || data.email === '' ? '---@---.--' : data.email}</Text>
                <Text truncate>
                    {data.lastLogin ? new Date(data.lastLogin).toLocaleString() : 'Never'}
                </Text>
                <Text truncate>
                    {data.lastActivity ? new Date(data.lastActivity).toLocaleString() : 'Never'}
                </Text>
                <Select
                    disabled={disabled}
                    value={[data.role]}
                    items={userRole.map((role) => ({ label: role, value: role }))}
                    onValueChange={(value) => {
                        onEdit(data.id, { role: value.value[0] as ApiUpdateUser['role'] });
                    }}
                />
            </Card.Body>
        </Card.Root>
    );
};
