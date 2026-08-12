import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';
import type { ApiGetWorkEvent } from '@shared/types/api/api-work-event';
import type { FC } from 'react';

const WorkEventEditor: FC<{
    data: ApiGetWorkEvent;
    open: boolean;
    setOpen: (open: boolean) => void;
}> = ({ data, open, setOpen }) => {
    return (
        <Dialog.Root
            placement={'center'}
            open={open}
            size="sm"
            onOpenChange={(e) => setOpen(e.open)}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                        <Dialog.Header>
                            <Dialog.Title>Event Editor</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body></Dialog.Body>
                        <Dialog.Footer>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button colorPalette="red">Delete</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default WorkEventEditor;
