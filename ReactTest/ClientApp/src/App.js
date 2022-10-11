import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Layout from './components/Layout';
import './custom.css';

const App = () => (
    <Layout module='Module1'>
        <Routes>
            {AppRoutes.map((route, index) => {
                const { element, requireAuth, ...rest } = route;

                return <Route key={index} {...rest} element={element} />;
            })}
        </Routes>
    </Layout>
);

export default App;
