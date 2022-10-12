import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";
import Nav from './Nav-component';
import Account from './pages/Account-page';
import Home from './pages/Home-page';
import Login from './pages/Login-page';
import Signup from './pages/Signup-page';
  
  export default function App() {
    return (
      <>
      <Router>
        <Nav />
        <Routes>
          <Route path="app/" element={<Home />} />
          <Route path="app/account" element={<Account />} />
          <Route path="app/login" element={<Login />} />
          <Route path="app/signup" element={<Signup />} />
        </Routes>
      </Router>
      </>
    );
  }