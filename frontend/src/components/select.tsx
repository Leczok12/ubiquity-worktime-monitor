import type { FC } from 'react';
import {
    type SelectRootProps,
    Select as ChakraSelect,
    createListCollection,
    Portal,
} from '@chakra-ui/react';

const Select: FC<
    Omit<SelectRootProps, 'collection'> & {
        placeholder?: string;
        items?: { label: string; value: string }[];
    }
> = ({ items, placeholder, ...props }) => {
    const itemsCollection = createListCollection({ items: items ?? [] });

    return (
        <ChakraSelect.Root {...props} collection={itemsCollection}>
            <ChakraSelect.HiddenSelect />
            <ChakraSelect.Control>
                <ChakraSelect.Trigger>
                    <ChakraSelect.ValueText placeholder={placeholder} />
                </ChakraSelect.Trigger>
                <ChakraSelect.IndicatorGroup>
                    <ChakraSelect.Indicator />
                </ChakraSelect.IndicatorGroup>
            </ChakraSelect.Control>
            <Portal>
                <ChakraSelect.Positioner>
                    <ChakraSelect.Content>
                        {itemsCollection.items.map((item) => (
                            <ChakraSelect.Item item={item} key={item.value}>
                                {item.label}
                                <ChakraSelect.ItemIndicator />
                            </ChakraSelect.Item>
                        ))}
                    </ChakraSelect.Content>
                </ChakraSelect.Positioner>
            </Portal>
        </ChakraSelect.Root>
    );
};

export default Select;
