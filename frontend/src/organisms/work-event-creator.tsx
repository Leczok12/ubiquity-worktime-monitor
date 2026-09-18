import { CloseButton, Dialog, Heading, DateInput, Portal, parseDate } from '@chakra-ui/react';
import { updateApiWorkEvent } from '@src/api/api-work-events';
import Alert from '@src/components/alert';
import { WorkEventsTable, WorkEventsTableRow } from '@src/components/work-events-table';
import WorkEventsTimeline from '@src/components/work-events-timeline';
import { WorkEventsContext } from '@src/hooks/use-work-events-context';
import { useContext, useEffect, useState, type FC } from 'react';
import { useForm } from 'react-hook-form';

type CreateWorkEventInput = {
    start: Date;
    end: Date;
    description?: string;
};

const WorkEventCreator: FC<{
    open?: boolean;
    onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
    const userLocale = navigator.language || 'en-US';
    const workEventsContext = useContext(WorkEventsContext);

    const [error, setError] = useState<string | undefined>(undefined);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateWorkEventInput>({});

    useEffect(() => {
        if (open) setError(undefined);
    }, [open]);

    return (
        <Dialog.Root
            scrollBehavior={'inside'}
            placement={'center'}
            open={open}
            size="cover"
            onOpenChange={(e) => onOpenChange(e.open)}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton />
                        </Dialog.CloseTrigger>

                        <Dialog.Header>
                            <Dialog.Title>Work event creator</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body as="form" onSubmit={handleSubmit((data) => console.log(data))}>
                            <DateInput.Root
                                locale={userLocale}
                                defaultValue={[parseDate(new Date())]}
                                invalid
                                granularity="minute"
                            >
                                <DateInput.Label>Since</DateInput.Label>
                                <DateInput.Control>
                                    <DateInput.Segments />
                                </DateInput.Control>
                                <DateInput.HiddenInput />
                            </DateInput.Root>
                            <DateInput.Root
                                locale={userLocale}
                                defaultValue={[parseDate(new Date())]}
                                invalid
                                granularity="minute"
                            >
                                <DateInput.Label>Until</DateInput.Label>
                                <DateInput.Control>
                                    <DateInput.Segments />
                                </DateInput.Control>
                                <DateInput.HiddenInput />
                            </DateInput.Root>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default WorkEventCreator;

/*
<form onSubmit={onSubmit}>
      <Stack gap="4" align="flex-start" maxW="sm">
        <Field.Root invalid={!!formState.errors.name}>
          <Field.Label>Name</Field.Label>
          <Input placeholder="Enter your name" />
          <Field.ErrorText>{formState.errors.name?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!formState.errors.dob}>
          <Controller
            control={control}
            name="dob"
            render={({ field }) => (
              <DateInput.Root
                value={field.value}
                onValueChange={(e) => field.onChange(e.value)}
                invalid={!!formState.errors.dob}
              >
                <DateInput.Label>Date of birth</DateInput.Label>
                <DateInput.Control>
                  <DateInput.Segments />
                </DateInput.Control>
                <DateInput.HiddenInput />
              </DateInput.Root>
            )}
          />
          <Field.ErrorText>{formState.errors.dob?.message}</Field.ErrorText>
        </Field.Root>
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
 */
