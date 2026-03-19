import { type FC } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { BsSearch } from 'react-icons/bs';

type Inputs = {
    groupId?: string;
    keyword?: string;
};

const SearchWorkerForm: FC<{
    onSubmit: SubmitHandler<Inputs>;
    groups: { id: string; name: string }[];
    disabled?: boolean;
}> = ({ onSubmit, groups, disabled = false }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Inputs>();

    const handleFormSubmit: SubmitHandler<Inputs> = (data) => {
        const newData: Inputs = {
            keyword: data.keyword !== '' ? data.keyword : undefined,
            groupId: data.groupId !== '' ? data.groupId : undefined,
        };
        onSubmit(newData);
    };

    return (
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
            <Form.Control
                disabled={disabled}
                isInvalid={!!errors.keyword}
                type="text"
                placeholder="Keyword..."
                {...register('keyword', {
                    onChange: () => setValue('groupId', ''),
                })}
            />
            <Form.Select
                disabled={disabled}
                {...register('groupId', {
                    onChange: () => setValue('keyword', ''),
                })}
                isInvalid={!!errors.groupId}
            >
                <option value="">None</option>
                {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                        {group.name}
                    </option>
                ))}
            </Form.Select>
            <Button disabled={disabled} type="submit">
                <BsSearch />
            </Button>
        </Form>
    );
};

export default SearchWorkerForm;
