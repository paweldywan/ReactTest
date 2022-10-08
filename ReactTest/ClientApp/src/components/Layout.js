import React from 'react';
import { Container, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import NavMenu from './NavMenu';
import AppRoutes from '../AppRoutes';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Layout = ({ module, children }) => {
    const location = useLocation();

    const { pathname } = location;

    return (
        <div>
            <NavMenu />
            <Container>
                <Breadcrumb>
                    <BreadcrumbItem active={pathname === '/'} key={module} tag={Link} to='/'>{module}</BreadcrumbItem>
                    {AppRoutes.map(route => {
                        const { name, path } = route;

                        const active = pathname === path;

                        return active && name ? <BreadcrumbItem active={active} key={name}>{active ? name : <Link to={path || '/'}>{name}</Link>}</BreadcrumbItem> : null
                    })}
                </Breadcrumb>
                {children}
            </Container>
        </div>
    );
};

export default Layout;