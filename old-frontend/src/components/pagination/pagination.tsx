import type { FC } from 'react';
import { Pagination as BsPagination } from 'react-bootstrap';
import styles from './pagination.module.scss';

const Pagination: FC<{ pageNumber: number; totalPages: number; onPageChange: (page: number) => void }> = ({
    pageNumber,
    totalPages,
    onPageChange,
}) => {
    const start = Math.max(1, Math.min(pageNumber - 1, totalPages - 2));
    const end = Math.min(totalPages, start + 2);
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={styles.paginationWrapper}>
            <BsPagination className={styles.pagination}>
                <BsPagination.First disabled={pageNumber <= 1} onClick={() => onPageChange(1)} />
                <BsPagination.Prev disabled={pageNumber <= 1} onClick={() => onPageChange(pageNumber - 1)} />
                {pages.map((page) => (
                    <BsPagination.Item key={page} active={page === pageNumber} onClick={() => onPageChange(page)}>
                        {page}
                    </BsPagination.Item>
                ))}
                <BsPagination.Next disabled={pageNumber >= totalPages} onClick={() => onPageChange(pageNumber + 1)} />
                <BsPagination.Last disabled={pageNumber >= totalPages} onClick={() => onPageChange(totalPages)} />
            </BsPagination>
        </div>
    );
};

export default Pagination;
