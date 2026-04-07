import { UserContext } from '@src/hooks/use-user-context';
import { useContext, type FC } from 'react';

import { Container, Nav, Navbar as BsNavbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router';

const NavBar: FC = () => {
    const user = useContext(UserContext);

    if (!user) {
        return null;
    }

    return (
        <BsNavbar className="bg-body-tertiary" sticky="top">
            <Container fluid>
                <BsNavbar.Brand to={'/'} as={Link}>
                    Ubiquiti Worktime Monitor
                </BsNavbar.Brand>
                <Nav className="ms-auto my-2 my-lg-0">
                    {user.role == 'WORKER' ? (
                        <Nav.Link to={'/'} as={Link}>
                            {user.email}
                        </Nav.Link>
                    ) : (
                        <NavDropdown title={user.email} align={'end'}>
                            <NavDropdown.Item to={'/'} as={Link}>
                                Home page
                            </NavDropdown.Item>
                            {user.role == 'SYSTEM_ADMIN' && (
                                <NavDropdown.Item to={'/admin'} as={Link}>
                                    Admin panel
                                </NavDropdown.Item>
                            )}
                            <NavDropdown.Divider />
                            <NavDropdown.Item to={'/auth/change-password'} as={Link}>
                                Change password
                            </NavDropdown.Item>
                            <NavDropdown.Item to={'/auth/logout'} as={Link}>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    )}
                </Nav>
            </Container>
        </BsNavbar>
    );
};

export default NavBar;
