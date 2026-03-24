import { type FC } from 'react';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { BsSearch } from 'react-icons/bs';

type Inputs = {
    until: string;
    since: string;
};

const formatDateInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const getLocaleFirstDay = (locale: string): number => {
    try {
        const localeWithWeekInfo = new Intl.Locale(locale) as Intl.Locale & {
            weekInfo?: { firstDay?: number };
        };
        const firstDay = localeWithWeekInfo.weekInfo?.firstDay;
        if (typeof firstDay === 'number') {
            // Intl.Locale returns 1..7 (Mon..Sun). JS Date uses 0..6 (Sun..Sat).
            return firstDay % 7;
        }
    } catch {
        // Fallback below.
    }

    return locale.toLowerCase().startsWith('en-us') ? 0 : 1;
};

const getCurrentWeekRange = (locale: string): { since: Date; until: Date } => {
    const now = new Date();
    const firstDay = getLocaleFirstDay(locale);

    const since = new Date(now);
    since.setHours(0, 0, 0, 0);
    since.setDate(now.getDate() - ((now.getDay() - firstDay + 7) % 7));

    const until = new Date(since);
    until.setDate(since.getDate() + 6);
    until.setHours(23, 59, 59, 999);

    return { since, until };
};

const SearchWorkDayForm: FC<{
    onSubmit: SubmitHandler<{ until: Date; since: Date }>;
    disabled?: boolean;
}> = ({ onSubmit, disabled = false }) => {
    const locale = typeof navigator === 'undefined' ? 'en-US' : navigator.language;
    const currentWeek = getCurrentWeekRange(locale);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            since: formatDateInput(currentWeek.since),
            until: formatDateInput(currentWeek.until),
        },
    });

    const handleFormSubmit: SubmitHandler<Inputs> = (data) => {
        onSubmit({
            since: new Date(`${data.since}T00:00:00`),
            until: new Date(`${data.until}T00:00:00`),
        });
    };

    return (
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
            <Form.Control
                disabled={disabled}
                isInvalid={!!errors.since}
                type="date"
                placeholder="Since..."
                {...register('since', {})}
            />
            <Form.Control
                disabled={disabled}
                isInvalid={!!errors.until}
                type="date"
                placeholder="Until..."
                {...register('until', {})}
            />

            <Button disabled={disabled} type="submit">
                <BsSearch />
            </Button>
            <ButtonGroup>
                <Button
                    disabled={disabled}
                    onClick={() => {
                        const week = getCurrentWeekRange(locale);
                        setValue('since', formatDateInput(week.since));
                        setValue('until', formatDateInput(week.until));
                    }}
                >
                    Week
                </Button>
                <Button
                    disabled={disabled}
                    active={true}
                    onClick={() => {
                        const monthAgo = new Date();
                        monthAgo.setDate(monthAgo.getDate() - 30);

                        setValue('since', formatDateInput(monthAgo));
                        setValue('until', formatDateInput(new Date()));
                    }}
                >
                    Month
                </Button>
            </ButtonGroup>
        </Form>
    );
};

export default SearchWorkDayForm;
