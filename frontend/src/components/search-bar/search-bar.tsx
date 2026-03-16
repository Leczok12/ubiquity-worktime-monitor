import { useState, type FC } from 'react';
import { Button, Form } from 'react-bootstrap';
import styles from './search-bar.module.scss';
import { BsSearch } from 'react-icons/bs';

const SearchBar: FC<{ onSearch: (keyword: string) => void; disabled?: boolean }> = ({ onSearch, disabled = false }) => {
    const [keyword, setKeyword] = useState('');

    return (
        <div className={styles.searchBar}>
            <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    disabled={disabled}
                />
                <Button type="submit" onClick={() => onSearch(keyword)} disabled={disabled}>
                    <BsSearch />
                </Button>
            </Form>
        </div>
    );
};

export default SearchBar;
