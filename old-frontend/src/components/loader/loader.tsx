import styles from './loader.module.scss';
import { SplashScreen } from '../splash-screen';
import type { FC } from 'react';

const Loader: FC<{ compact?: boolean }> = ({ compact = false }) => {
    if (compact) {
        return (
            <div className={styles.compactLoader}>
                <span className={styles.loader} />
            </div>
        );
    }
    return (
        <SplashScreen>
            <span className={styles.loader} />
        </SplashScreen>
    );
};

export default Loader;
