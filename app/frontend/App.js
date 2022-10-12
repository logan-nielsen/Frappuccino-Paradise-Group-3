import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";
import Nav from './Nav';
import AccountPage from './pages/AccountPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
  
  export default function App() {
    return (
      <>
      <Router>
        <Nav />
        <Routes>
          <Route path="app/" element={<HomePage />} />
          <Route path="app/home" element={<HomePage />} />
          <Route path="app/account" element={<AccountPage />} />
          <Route path="app/login" element={<LoginPage />} />
          <Route path="app/signup" element={<SignupPage />} />
        </Routes>
      </Router>
      </>
    );
  }