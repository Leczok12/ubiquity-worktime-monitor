import { Alert as ChakraAlert, type AlertRootProps, Icon } from '@chakra-ui/react';
import type { FC } from 'react';

const Alert: FC<
    AlertRootProps & { title?: string; icon?: React.ReactNode; description: string }
> = ({ title, icon, description, ...props }) => {
    return (
        <ChakraAlert.Root
            variant={'subtle'}
            {...props}
            display={'flex'}
            flexDirection={'row'}
            alignItems={'center'}
        >
            {(icon || title) && (
                <ChakraAlert.Title display={'flex'} alignItems={'center'} gap={2}>
                    {icon && (
                        <Icon size="lg" p={0} m={0} display={'flex'} alignItems={'center'}>
                            {icon}
                        </Icon>
                    )}
                    {title && title}
                </ChakraAlert.Title>
            )}
            <ChakraAlert.Description>{description}</ChakraAlert.Description>
        </ChakraAlert.Root>
    );
};

export default Alert;
