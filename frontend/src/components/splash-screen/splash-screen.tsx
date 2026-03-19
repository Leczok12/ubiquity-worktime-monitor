import type { FC, PropsWithChildren } from 'react';
import styles from './splash-screen.module.scss';

const SplashScreen: FC<PropsWithChildren> = ({ children }) => {
    return <div className={styles.splashScreen}>{children}</div>;
};

export default SplashScreen;
