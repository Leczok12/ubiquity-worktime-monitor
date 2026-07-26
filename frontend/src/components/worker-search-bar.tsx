import { Card, IconButton, Input, Portal, Select, createListCollection } from '@chakra-ui/react';
import { getApiGroups } from '@src/api/api-group';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { GrSearch } from 'react-icons/gr';
import { useSearchParams } from 'react-router';

const WorkerSearchBar: React.FC<{
    onSearch: (keyword: string | undefined, groupId: string | undefined) => void;
}> = ({ onSearch }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [keyword, setKeyword] = useState<string | undefined>(undefined);
    const [groupId, setGroupId] = useState<string | undefined>(undefined);
    const lastSyncedSearchParams = useRef('');

    useEffect(() => {
        const nextKeyword = searchParams.get('keyword') ?? undefined;
        const nextGroupId = searchParams.get('groupId') ?? undefined;
        const nextSearchParamsString = searchParams.toString();

        setKeyword(nextKeyword);
        setGroupId(nextGroupId);

        if (
            nextSearchParamsString !== lastSyncedSearchParams.current &&
            (nextKeyword || nextGroupId)
        ) {
            onSearch(nextKeyword, nextGroupId);
        }

        lastSyncedSearchParams.current = nextSearchParamsString;
    }, [searchParams]);

    const handleSearch = () => {
        const nextSearchParams = new URLSearchParams(searchParams);

        if (keyword) {
            nextSearchParams.set('keyword', keyword);
        } else {
            nextSearchParams.delete('keyword');
        }

        if (groupId) {
            nextSearchParams.set('groupId', groupId);
        } else {
            nextSearchParams.delete('groupId');
        }

        setSearchParams(nextSearchParams);
        onSearch(keyword, groupId);
    };

    const { data } = useQuery({
        queryKey: ['search', 'groups'],
        queryFn: async () => {
            return getApiGroups();
        },
    });

    const groups = !data?.data
        ? undefined
        : createListCollection({
              items: data.data.map((group) => ({ value: group.id, label: group.name })),
          });

    return (
        <Card.Root>
            <Card.Body
                as="form"
                p={'15px'}
                display={'flex'}
                flexDirection={'row'}
                flexWrap={'wrap'}
                alignItems={'flex-end'}
                gap={4}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
            >
                <Input
                    placeholder="Search workers..."
                    value={keyword ?? ''}
                    order={{ base: 1, md: 1 }}
                    flex="1 1 0"
                    minWidth="0"
                    variant="outline"
                    onChange={(e) => {
                        setGroupId(undefined);
                        setKeyword(e.target.value || undefined);
                    }}
                />
                {groups && (
                    <Select.Root
                        collection={groups}
                        order={{ base: 3, md: 2 }}
                        width={{ base: 'full', md: '160px' }}
                        flex={{ base: '1 0 100%', md: '0 0 160px' }}
                        value={groupId ? [groupId] : []}
                        onValueChange={(value) => {
                            setKeyword(undefined);
                            setGroupId(value.value[0]);
                        }}
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Select group" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {groups.items.map((group) => (
                                        <Select.Item item={group} key={group.value}>
                                            {group.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                )}
                <IconButton
                    type="submit"
                    variant="outline"
                    order={{ base: 2, md: 3 }}
                    flexShrink={0}
                >
                    <GrSearch />
                </IconButton>
            </Card.Body>
        </Card.Root>
    );
};

export default WorkerSearchBar;
