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
            bottom="calc(1rem )"
            left="0"
            right="0"
            display="flex"
            justifyContent="center"
            px={{ base: 2, sm: 4 }}
            zIndex="1000"
            pointerEvents="none"
        >
            <ChakraPagination.Root
                count={count}
                pageSize={pageSize}
                onPageChange={onPageChange}
                defaultPage={pageNumber}
                display="flex"
                alignItems="center"
                maxW="100%"
                minW="0"
                p="1"
                gap={{ base: 1, sm: 2 }}
                borderWidth="1px"
                borderColor="border.muted"
                borderRadius="lg"
                bg="bg.panel"
                pointerEvents="auto"
            >
                <ButtonGroup variant="ghost" size={{ base: 'xs', sm: 'sm' }} flexShrink={0}>
                    <ChakraPagination.PrevTrigger asChild>
                        <IconButton aria-label="Previous page">
                            <LuChevronLeft />
                        </IconButton>
                    </ChakraPagination.PrevTrigger>

                    <Box
                        display="flex"
                        alignItems="center"
                        minW="0"
                        overflowX="auto"
                        css={{
                            scrollbarWidth: 'none',
                            '&::-webkit-scrollbar': { display: 'none' },
                        }}
                    >
                        <ChakraPagination.Items
                            render={(page) => (
                                <IconButton
                                    aria-label={`Page ${page.value}`}
                                    variant={{ base: 'ghost', _selected: 'outline' }}
                                    size={{ base: 'xs', sm: 'sm' }}
                                    flexShrink={0}
                                >
                                    {page.value}
                                </IconButton>
                            )}
                        />
                    </Box>

                    <ChakraPagination.NextTrigger asChild>
                        <IconButton aria-label="Next page">
                            <LuChevronRight />
                        </IconButton>
                    </ChakraPagination.NextTrigger>
                </ButtonGroup>
            </ChakraPagination.Root>
        </Box>
    );
};

export default Pagination;
