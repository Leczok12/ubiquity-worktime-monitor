import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Button, Drawer, Tooltip, useOverlayState } from '@heroui/react';
import { FiGrid, FiMenu, FiMonitor, FiSettings, FiUsers, FiX } from 'react-icons/fi';
import style from './admin-layout.module.css';

type AdminNavItem = {
    label: string;
    href?: string;
    icon: typeof FiGrid;
    description: string;
    disabled?: boolean;
};

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const drawerState = useOverlayState();

    const navItems = useMemo<AdminNavItem[]>(
        () => [
            {
                label: 'Panel',
                href: '/admin',
                icon: FiGrid,
                description: 'Widok ogólny i szybki podgląd',
            },
            {
                label: 'Urządzenia',
                href: '/admin/device',
                icon: FiMonitor,
                description: 'Lista i stan urządzeń',
            },
            {
                label: 'Zespół',
                icon: FiUsers,
                description: 'Zarządzanie użytkownikami',
                disabled: true,
            },
            {
                label: 'Ustawienia',
                icon: FiSettings,
                description: 'Konfiguracja panelu admina',
                disabled: true,
            },
        ],
        []
    );

    const isItemActive = (href?: string) => {
        if (!href) {
            return false;
        }

        if (href === '/admin') {
            return location.pathname === '/admin';
        }

        return location.pathname === href || location.pathname.startsWith(`${href}/`);
    };

    const handleNavigate = (href?: string) => {
        if (!href) {
            return;
        }

        navigate(href);
        drawerState.close();
    };

    const renderNavItem = (item: AdminNavItem, mobile = false) => {
        const active = isItemActive(item.href);
        const Icon = item.icon;
        const itemClassName = [
            mobile ? style.mobileNavItem : style.navIconButton,
            active ? style.navIconButtonActive : '',
            item.disabled ? style.navIconButtonDisabled : '',
        ]
            .filter(Boolean)
            .join(' ');

        if (mobile) {
            return (
                <button
                    key={item.label}
                    className={itemClassName}
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    disabled={item.disabled}
                    aria-label={item.label}
                    data-active={active}
                    data-disabled={item.disabled}
                >
                    <span className={style.mobileNavItemIcon}>
                        <Icon />
                    </span>
                    <span className={style.mobileNavItemText}>
                        <strong>{item.label}</strong>
                        <span>{item.description}</span>
                    </span>
                    <span className={style.mobileNavItemMeta}>{item.disabled ? 'Wkrótce' : 'Otwórz'}</span>
                </button>
            );
        }

        return (
            <Tooltip.Root key={item.label} delay={0} closeDelay={0}>
                <Tooltip.Trigger
                    aria-label={item.label}
                    className={itemClassName}
                    onClick={() => handleNavigate(item.href)}
                    data-active={active}
                    data-disabled={item.disabled}
                >
                    <Icon />
                </Tooltip.Trigger>
                <Tooltip.Content className={style.tooltipContent}>
                    <div className={style.tooltipTitle}>{item.label}</div>
                    <div className={style.tooltipDescription}>{item.description}</div>
                </Tooltip.Content>
            </Tooltip.Root>
        );
    };

    return (
        <div className={style.adminLayout}>
            <aside className={style.desktopSidebar}>
                <div className={style.brandMark} aria-hidden="true">
                    <FiGrid />
                </div>

                <nav className={style.navList} aria-label="Admin menu">
                    {navItems.map((item) => renderNavItem(item))}
                </nav>

                <div className={style.sidebarFooter}>
                    <div className={style.sidebarHint}>Admin</div>
                </div>
            </aside>

            <div className={style.mobileFrame}>
                <header className={style.mobileTopBar}>
                    <div>
                        <div className={style.mobileEyebrow}>Panel administracyjny</div>
                        <h1 className={style.mobileTitle}>Ubiquity Worktime</h1>
                    </div>

                    <Button
                        isIconOnly
                        aria-label="Otwórz menu"
                        variant="danger"
                        className={style.mobileMenuButton}
                        onPress={drawerState.open}
                    >
                        <FiMenu />
                    </Button>
                </header>

                <main className={style.contentShell}>
                    <Outlet />
                </main>
            </div>

            <Drawer state={drawerState}>
                <Drawer.Backdrop className={style.drawerBackdrop} />
                <Drawer.Content placement="left" className={style.drawerContent}>
                    <Drawer.Dialog className={style.drawerDialog}>
                        <Drawer.Header className={style.drawerHeader}>
                            <div>
                                <div className={style.mobileEyebrow}>Nawigacja</div>
                                <Drawer.Heading className={style.drawerHeading}>Admin panel</Drawer.Heading>
                            </div>

                            <Button
                                isIconOnly
                                aria-label="Zamknij menu"
                                variant="flat"
                                className={style.drawerCloseButton}
                                onPress={drawerState.close}
                            >
                                <FiX />
                            </Button>
                        </Drawer.Header>

                        <Drawer.Body className={style.drawerBody}>
                            <nav className={style.mobileNavList} aria-label="Admin menu mobile">
                                {navItems.map((item) => renderNavItem(item, true))}
                            </nav>
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer>
        </div>
    );
};

export default AdminLayout;
