import React from 'react';
import { Container, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { NavMenu } from './NavMenu';
import AppRoutes from '../AppRoutes';

export const Layout = ({ module, children }) => {
    return (
        <div>
            <NavMenu />
            <Container>
                <Breadcrumb>
                    <BreadcrumbItem key={module}><a href="#">{module}</a></BreadcrumbItem>
                    {AppRoutes.map(route => {
                        const { name } = route;
                        return name ? <BreadcrumbItem key={name}>{name}</BreadcrumbItem> : null
                    })}
                </Breadcrumb>
                {children}
            </Container>
        </div>
    );
};