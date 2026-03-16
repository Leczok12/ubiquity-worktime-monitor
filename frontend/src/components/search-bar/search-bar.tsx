import { useState, type FC } from 'react';
import { BsSearch } from 'react-icons/bs';
import styles from './search-bar.module.scss';
import { Button, Form } from 'react-bootstrap';

const SearchBar: FC<{ onSearch: (keyword: string) => void; disabled?: boolean }> = ({ onSearch, disabled = false }) => {
    const [keyword, setKeyword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!disabled) {
            onSearch(keyword);
        }
    };

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
        </Form>
    );
};

export default SearchBar;
