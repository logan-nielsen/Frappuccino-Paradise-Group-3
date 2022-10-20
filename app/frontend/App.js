import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";
import Nav from './components/Nav';
import AccountPage from './pages/AccountPage';
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';

export default function App() {
  return (
    <>
    <Router>
      <Nav> 
        <Routes>
          <Route path="app/" element={<HomePage />} />
          <Route path="app/home" element={<HomePage />} />
          <Route path="app/account" element={<AccountPage />} />
          <Route path="app/order" element={<OrderPage />} />
        </Routes>
      </Nav>
    </Router>
    </>
  );
}