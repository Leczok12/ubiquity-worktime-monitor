import type { FC } from 'react';
import { Pagination as ChakraPagination, Box, ButtonGroup, IconButton } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

interface PaginationProps {
    show: boolean;
    count: number;
    pageNumber: number;
    pageSize: number;
    onPageChange: (details: { page: number }) => void;
}

const Pagination: FC<PaginationProps> = ({ show, count, pageNumber, pageSize, onPageChange }) => {
    if (!show) {
        return null;
    }

    return (
        <Box
            position="fixed"
            bottom="4"
            left="0"
            right="0"
            display="flex"
            justifyContent="center"
            zIndex="1000"
            p="2"
        >
            <ChakraPagination.Root
                count={count}
                pageSize={pageSize}
                onPageChange={onPageChange}
                defaultPage={pageNumber}
            >
                <ButtonGroup variant="ghost" size="sm">
                    <ChakraPagination.PrevTrigger asChild>
                        <IconButton>
                            <LuChevronLeft />
                        </IconButton>
                    </ChakraPagination.PrevTrigger>

                    <ChakraPagination.Items
                        render={(page) => (
                            <IconButton variant={{ base: 'ghost', _selected: 'outline' }}>
                                {page.value}
                            </IconButton>
                        )}
                    />

                    <ChakraPagination.NextTrigger asChild>
                        <IconButton>
                            <LuChevronRight />
                        </IconButton>
                    </ChakraPagination.NextTrigger>
                </ButtonGroup>
            </ChakraPagination.Root>
        </Box>
    );
};

export default Pagination;
