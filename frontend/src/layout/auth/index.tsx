import { Outlet } from 'react-router';
import styles from './auth.module.scss';

const AuthLayout = () => {
    return (
        <div className={styles.container}>
            <Outlet />
        </div>
    );
};

export default AuthLayout;
