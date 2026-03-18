import { useState, type FC } from 'react';
import { BsSearch } from 'react-icons/bs';
import styles from './search-bar.module.scss';
import { Button, Form } from 'react-bootstrap';
import { useGroup } from '@src/hooks/use-group';

const SearchBar: FC<{ onSearch: (keyword: string) => void; disabled?: boolean }> = ({ onSearch, disabled = false }) => {
    const [keyword, setKeyword] = useState('');
    const { data } = useGroup();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!disabled) {
            onSearch(keyword);
        }
    };

    console.log(data);

    return (
        <Form onSubmit={handleSubmit} className={styles.searchForm}>
            <Form.Control
                type="text"
                placeholder="Search..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                disabled={disabled}
                className={styles.input}
            />
            <Button type="submit" disabled={disabled} className={styles.button}>
                <BsSearch />
            </Button>
            <Form.Select onChange={(e) => console.log(e.target.value)} className={styles.select}>
                <option value={undefined}>All Groups</option>
                {data?.map((group) => (
                    <option key={group.id} value={group.id}>
                        {group.name}
                    </option>
                ))}
            </Form.Select>
        </Form>
    );
};

export default SearchBar;
