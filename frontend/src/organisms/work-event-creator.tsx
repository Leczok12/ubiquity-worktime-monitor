import {
    CloseButton,
    Dialog,
    Portal,
    Field,
    Button,
    Select,
    createListCollection,
    Spinner,
    NumberInput,
    Box,
    DatePicker,
} from '@chakra-ui/react';
import { WorkEventsContext } from '@src/hooks/use-work-events-context';
import { useContext, useEffect, useState, type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { parseDate } from '@internationalized/date';
import { LuCalendar } from 'react-icons/lu';
import { RxReset } from 'react-icons/rx';
import Alert from '@src/components/alert';

type CreateWorkEventInput = {
    sinceDate: string;
    sinceHour: string;
    sinceMinute: string;
    untilDate: string;
    untilHour: string;
    untilMinute: string;
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
    } = useForm<CreateWorkEventInput>({
        defaultValues: {
            sinceHour: new Date().getHours().toString(),
            sinceMinute: new Date().getMinutes().toString(),
            sinceDate: new Date().toISOString().slice(0, new Date().toISOString().indexOf('T')),
            untilHour: new Date().getHours().toString(),
            untilMinute: new Date().getMinutes().toString(),
            untilDate: new Date().toISOString().slice(0, new Date().toISOString().indexOf('T')),
            type: 'WORK',
        },
    });

    useEffect(() => {
        if (open) {
            setError(undefined);
            reset();
        }
    }, [open]);

    useEffect(() => {
        if (open && !context.isProcessing && !error) {
            onOpenChange(false);
        }
    }, [context.isProcessing]);

    const onSubmit = async (data: CreateWorkEventInput) => {
        const since = new Date(data.sinceDate);
        since.setHours(parseInt(data.sinceHour), parseInt(data.sinceMinute), 0, 0);

        const until = new Date(data.untilDate);
        until.setHours(parseInt(data.untilHour), parseInt(data.untilMinute), 0, 0);

        if (since >= until) {
            setFormError('untilDate', {
                type: 'manual',
                message: 'Until date must be after since date',
            });
            setFormError('untilHour', {
                type: 'manual',
            });
            setFormError('untilMinute', {
                type: 'manual',
            });
            setFormError('sinceDate', {
                type: 'manual',
                message: 'Since date must be before until date',
            });
            setFormError('sinceHour', {
                type: 'manual',
            });
            setFormError('sinceMinute', {
                type: 'manual',
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
                            display={!!error ? 'flex' : 'none'}
                            flexDirection={'column'}
                            gap={4}
                        >
                            {error && <Alert title="Error" status="error" description={error} />}
                        </Dialog.Body>

                        <Dialog.Body
                            display={!!!error ? 'flex' : 'none'}
                            flexDirection={'column'}
                            gap={4}
                            as="form"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Box
                                display={'flex'}
                                gap={2}
                                flexDirection={'row'}
                                alignItems={'flex-end'}
                            >
                                <Field.Root invalid={!!errors.sinceHour}>
                                    <Field.Label>Since</Field.Label>
                                    <Controller
                                        name="sinceHour"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <NumberInput.Root
                                                size="sm"
                                                w="100%"
                                                disabled={field.disabled}
                                                name={field.name}
                                                max={23}
                                                min={0}
                                                invalid={!!errors.sinceHour}
                                                value={field.value}
                                                onValueChange={({ value }) => {
                                                    field.onChange(value);
                                                }}
                                            >
                                                <NumberInput.Control />
                                                <NumberInput.Input onBlur={field.onBlur} />
                                            </NumberInput.Root>
                                        )}
                                    />
                                </Field.Root>
                                <Field.Root invalid={!!errors.sinceMinute}>
                                    <Controller
                                        name="sinceMinute"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <NumberInput.Root
                                                size="sm"
                                                w="100%"
                                                disabled={field.disabled}
                                                name={field.name}
                                                max={59}
                                                min={0}
                                                invalid={!!errors.sinceMinute}
                                                value={field.value}
                                                onValueChange={({ value }) => {
                                                    field.onChange(value);
                                                }}
                                            >
                                                <NumberInput.Control />
                                                <NumberInput.Input onBlur={field.onBlur} />
                                            </NumberInput.Root>
                                        )}
                                    />
                                </Field.Root>
                            </Box>
                            <Controller
                                name="sinceDate"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Field.Root invalid={!!errors.sinceDate}>
                                        <DatePicker.Root
                                            locale={userLocale}
                                            value={field.value ? [parseDate(field.value)] : []}
                                            onValueChange={(e) =>
                                                field.onChange(e.value[0]?.toString() ?? '')
                                            }
                                            invalid={!!errors.sinceDate}
                                        >
                                            <DatePicker.Control>
                                                <DatePicker.Input placeholder="Select date" />
                                                <DatePicker.IndicatorGroup>
                                                    <DatePicker.Trigger>
                                                        <LuCalendar />
                                                    </DatePicker.Trigger>
                                                </DatePicker.IndicatorGroup>
                                            </DatePicker.Control>
                                            <Portal>
                                                <DatePicker.Positioner>
                                                    <DatePicker.Content>
                                                        <DatePicker.View view="day">
                                                            <DatePicker.Header />
                                                            <DatePicker.DayTable />
                                                        </DatePicker.View>
                                                        <DatePicker.View view="month">
                                                            <DatePicker.Header />
                                                            <DatePicker.MonthTable />
                                                        </DatePicker.View>
                                                        <DatePicker.View view="year">
                                                            <DatePicker.Header />
                                                            <DatePicker.YearTable />
                                                        </DatePicker.View>
                                                    </DatePicker.Content>
                                                </DatePicker.Positioner>
                                            </Portal>
                                        </DatePicker.Root>
                                        <Field.ErrorText>
                                            {errors.sinceDate?.message}
                                        </Field.ErrorText>
                                    </Field.Root>
                                )}
                            />

                            <Box
                                display={'flex'}
                                gap={2}
                                flexDirection={'row'}
                                alignItems={'flex-end'}
                            >
                                <Field.Root invalid={!!errors.untilHour}>
                                    <Field.Label>Until</Field.Label>
                                    <Controller
                                        name="untilHour"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <NumberInput.Root
                                                size="sm"
                                                w="100%"
                                                disabled={field.disabled}
                                                name={field.name}
                                                max={23}
                                                min={0}
                                                invalid={!!errors.untilHour}
                                                value={field.value}
                                                onValueChange={({ value }) => {
                                                    field.onChange(value);
                                                }}
                                            >
                                                <NumberInput.Control />
                                                <NumberInput.Input onBlur={field.onBlur} />
                                            </NumberInput.Root>
                                        )}
                                    />
                                </Field.Root>
                                <Field.Root invalid={!!errors.untilMinute}>
                                    <Controller
                                        name="untilMinute"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <NumberInput.Root
                                                size="sm"
                                                w="100%"
                                                disabled={field.disabled}
                                                name={field.name}
                                                max={59}
                                                min={0}
                                                invalid={!!errors.untilMinute}
                                                value={field.value}
                                                onValueChange={({ value }) => {
                                                    field.onChange(value);
                                                }}
                                            >
                                                <NumberInput.Control />
                                                <NumberInput.Input onBlur={field.onBlur} />
                                            </NumberInput.Root>
                                        )}
                                    />
                                </Field.Root>
                            </Box>
                            <Controller
                                name="untilDate"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Field.Root invalid={!!errors.untilDate}>
                                        <DatePicker.Root
                                            locale={userLocale}
                                            value={field.value ? [parseDate(field.value)] : []}
                                            onValueChange={(e) =>
                                                field.onChange(e.value[0]?.toString() ?? '')
                                            }
                                            invalid={!!errors.untilDate}
                                        >
                                            <DatePicker.Control>
                                                <DatePicker.Input placeholder="Select date" />
                                                <DatePicker.IndicatorGroup>
                                                    <DatePicker.Trigger>
                                                        <LuCalendar />
                                                    </DatePicker.Trigger>
                                                </DatePicker.IndicatorGroup>
                                            </DatePicker.Control>
                                            <Portal>
                                                <DatePicker.Positioner>
                                                    <DatePicker.Content>
                                                        <DatePicker.View view="day">
                                                            <DatePicker.Header />
                                                            <DatePicker.DayTable />
                                                        </DatePicker.View>
                                                        <DatePicker.View view="month">
                                                            <DatePicker.Header />
                                                            <DatePicker.MonthTable />
                                                        </DatePicker.View>
                                                        <DatePicker.View view="year">
                                                            <DatePicker.Header />
                                                            <DatePicker.YearTable />
                                                        </DatePicker.View>
                                                    </DatePicker.Content>
                                                </DatePicker.Positioner>
                                            </Portal>
                                        </DatePicker.Root>
                                        <Field.ErrorText>
                                            {errors.untilDate?.message}
                                        </Field.ErrorText>
                                    </Field.Root>
                                )}
                            />

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
                                            <Select.Label>Type</Select.Label>
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

                            <Box display={'grid'} gap={2} gridTemplateColumns={'1fr 1fr'}>
                                <Button type="reset" variant="subtle" w="100%">
                                    <RxReset />
                                </Button>
                                <Button type="submit" variant="subtle">
                                    {context.isProcessing ? <Spinner /> : 'Create work event'}
                                </Button>
                            </Box>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default WorkEventCreator;
