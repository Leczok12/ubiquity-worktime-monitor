import { useState, type FC } from 'react';

const SearchBar: FC<{ onSearch: (keyword: string) => void }> = ({ onSearch }) => {
    const [keyword, setKeyword] = useState('');

    return (
        <div>
            <input type="text" placeholder="Search..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            <button onClick={() => onSearch(keyword)}>Search</button>
        </div>
    );
};

export default SearchBar;
