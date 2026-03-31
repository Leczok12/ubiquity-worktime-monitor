import { useEffect, type FC, type HTMLAttributes, type MouseEvent, type PropsWithChildren } from 'react';
import styles from './splash-screen.module.scss';

type SplashScreenProps = PropsWithChildren & HTMLAttributes<HTMLDivElement>;

const SplashScreen: FC<SplashScreenProps> = ({ children, className, onClick, ...props }) => {
    useEffect(() => {
        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, []);

    const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClick?.(event);
        }
    };

    return (
        <div className={`${styles.splashScreen} ${className || ''}`} onClick={handleBackdropClick} {...props}>
            {children}
        </div>
    );
};

export default SplashScreen;
