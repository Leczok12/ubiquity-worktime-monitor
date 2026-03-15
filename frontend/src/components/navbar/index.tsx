import type { ApiAuthUserResponse } from '@shared/api-auth';
import type { FC } from 'react';

import { Container, Nav, Navbar as BsNavbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router';

const NavBar: FC<{ user?: ApiAuthUserResponse }> = ({ user }) => {
    return (
        <BsNavbar expand="lg" className="bg-body-tertiary" sticky="top">
            <Container>
                <BsNavbar.Brand to={'/'} as={Link}>
                    Ubiquiti Worktime Monitor
                </BsNavbar.Brand>

                <Nav className="justify-content-end ">
                    <NavDropdown title={user?.email ?? 'Undefined'} align="end">
                        <NavDropdown.Item to={'/'} as={Link}>
                            Home page
                        </NavDropdown.Item>
                        {user?.roles.includes('SYSTEM_ADMIN') && (
                            <NavDropdown.Item to={'/admin'} as={Link}>
                                Admin panel
                            </NavDropdown.Item>
                        )}
                        <NavDropdown.Divider />
                        <NavDropdown.Item to={'/auth/logout'} as={Link}>
                            Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </BsNavbar>
    );
};

export default NavBar;
