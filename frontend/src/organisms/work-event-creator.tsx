import {
    CloseButton,
    Dialog,
    DateInput,
    Portal,
    Field,
    Button,
    Select,
    createListCollection,
    Spinner,
} from '@chakra-ui/react';
import { WorkEventsContext } from '@src/hooks/use-work-events-context';
import { useContext, useEffect, useState, type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CalendarDateTime } from '@internationalized/date';

type CreateWorkEventInput = {
    since: CalendarDateTime[];
    until: CalendarDateTime[];
    type: 'WORK' | 'BREAK';
};

const WorkEventCreator: FC<{
    open?: boolean;
    onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
    const userLocale = navigator.language || 'en-US';
    const context = useContext(WorkEventsContext);

    const [error, setError] = useState<string | undefined>(undefined);

    const types = createListCollection({
        items: [
            { value: 'WORK', label: 'Work' },
            { value: 'BREAK', label: 'Break' },
        ],
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError: setFormError,
        reset,
    } = useForm<CreateWorkEventInput>();

    useEffect(() => {
        if (open) {
            setError(undefined);
            reset({
                // since: [toCalendarDateTime(parseAbsoluteToLocal(new Date().toISOString()))],
                // until: [toCalendarDateTime(parseAbsoluteToLocal(new Date().toISOString()))],
                type: 'WORK',
            });
        }
    }, [open]);

    useEffect(() => {
        if (open && !context.isProcessing && !error) {
            onOpenChange(false);
        }
    }, [context.isProcessing]);

    const onSubmit = async (data: CreateWorkEventInput) => {
        const since = new Date(data.since[0].toString());
        const until = new Date(data.until[0].toString());

        if (since >= until) {
            setFormError('until', {
                type: 'manual',
                message: 'Until date must be after since date',
            });
            setFormError('since', {
                type: 'manual',
                message: 'Since date must be before until date',
            });
            return;
        }

        context
            .createEvent({
                sinceDate: since.toISOString(),
                untilDate: until.toISOString(),
                type: data.type,
            })
            .catch((error) =>
                setError(error.message || 'An error occurred while creating the work event')
            );
    };

    return (
        <Dialog.Root
            scrollBehavior={'inside'}
            placement={'center'}
            open={open}
            size="sm"
            onOpenChange={(e) => {
                if (!context.isProcessing) onOpenChange(e.open);
            }}
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
                        <Dialog.Body
                            display={'flex'}
                            flexDirection={'column'}
                            gap={4}
                            as="form"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Field.Root invalid={!!errors.since}>
                                <Controller
                                    control={control}
                                    rules={{ required: 'This field is required' }}
                                    name="since"
                                    render={({ field }) => (
                                        <DateInput.Root
                                            disabled={context.isProcessing}
                                            value={field.value}
                                            locale={userLocale}
                                            granularity="minute"
                                            invalid={!!errors.since}
                                            onValueChange={(e) => field.onChange(e.value)}
                                            onFocusChange={(e) => {
                                                if (e.focused) field.onChange([]);
                                            }}
                                            shouldForceLeadingZeros
                                        >
                                            <DateInput.Label>Since</DateInput.Label>
                                            <DateInput.Control>
                                                <DateInput.Segments />
                                            </DateInput.Control>
                                            <DateInput.HiddenInput />
                                        </DateInput.Root>
                                    )}
                                />
                                <Field.ErrorText>{errors.since?.message}</Field.ErrorText>
                            </Field.Root>
                            <Field.Root invalid={!!errors.until}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: 'This field is required',
                                    }}
                                    name="until"
                                    render={({ field }) => (
                                        <DateInput.Root
                                            disabled={context.isProcessing}
                                            value={field.value}
                                            locale={userLocale}
                                            granularity="minute"
                                            invalid={!!errors.until}
                                            onValueChange={(e) => field.onChange(e.value)}
                                            onFocusChange={(e) => {
                                                if (e.focused) field.onChange([]);
                                            }}
                                            shouldForceLeadingZeros
                                        >
                                            <DateInput.Label>Until</DateInput.Label>
                                            <DateInput.Control>
                                                <DateInput.Segments />
                                            </DateInput.Control>
                                            <DateInput.HiddenInput />
                                        </DateInput.Root>
                                    )}
                                />
                                <Field.ErrorText>{errors.until?.message}</Field.ErrorText>
                            </Field.Root>
                            <Field.Root invalid={!!errors.type}>
                                <Controller
                                    control={control}
                                    rules={{ required: 'This field is required' }}
                                    name="type"
                                    render={({ field }) => (
                                        <Select.Root
                                            disabled={context.isProcessing}
                                            collection={types}
                                            onValueChange={(value) =>
                                                field.onChange(value.value[0])
                                            }
                                            value={[field.value]}
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Label>Select type</Select.Label>
                                            <Select.Control>
                                                <Select.Trigger>
                                                    <Select.ValueText placeholder="Select type" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {types.items.map((framework) => (
                                                        <Select.Item
                                                            item={framework}
                                                            key={framework.value}
                                                        >
                                                            {framework.label}
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Select.Root>
                                    )}
                                />
                                <Field.ErrorText>{errors.type?.message}</Field.ErrorText>
                            </Field.Root>

                            <Button type="submit" variant="subtle" mt={4}>
                                {context.isProcessing ? <Spinner /> : 'Create work event'}
                            </Button>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default WorkEventCreator;
