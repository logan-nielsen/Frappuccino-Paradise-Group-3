import { ThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";
import Nav from './components/Nav';
import AccountPage from './pages/AccountPage';
import HomePage from './pages/HomePage';
import ManageOrdersPage from './pages/ManageOrdersPage';
import OrderPage from './pages/OrderPage';

import './styles/App.css';

const theme = createTheme();

export default function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Container component="main">
          <CssBaseline />
          <Nav> 
            <Routes>
              <Route path="app/" element={<HomePage />} />
              <Route path="app/home" element={<HomePage />} />
              <Route path="app/account" element={<AccountPage />} />
              <Route path="app/order" element={<OrderPage />} />
              <Route path="app/manage-orders" element={<ManageOrdersPage />} />
            </Routes>
          </Nav>
        </Container>
      </ThemeProvider>
    </Router>
  );
}