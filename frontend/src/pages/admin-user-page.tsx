import { Container, Heading } from '@chakra-ui/react';
import Alert from '@src/components/alert';

const AdminUsersPage = () => {
    const pageSize = 12;
    return (
        <Container pb={'60px'} display="flex" flexDirection="column" gap={6}>
            <Heading size="4xl">Users</Heading>
            <Alert
                status="warning"
                title="This page is currently under development. Some features may not work as expected."
                description="Edit users directly in the database."
            />
            {/* <WorkerSearchBar
                onSearch={(keyword, groupId) => {
                    setKeyword(keyword);
                    setGroupId(groupId);
                    setPageNumber(1);
                    refetch();
                }}
            />
            <AdminWorkerTable
                loading={isLoading}
                error={error?.message || updateError}
                data={data?.data}
                disabled={disabled || isFetching}
                onEdit={onEdit}
            />
            <Pagination
                show={data !== undefined}
                pageNumber={pageNumber}
                count={data?.pagination?.total || 1}
                pageSize={data?.pagination?.pageSize || 10}
                onPageChange={(details) => {
                    setPageNumber(details.page);
                }}
            /> */}
        </Container>
    );
};

export default AdminUsersPage;
