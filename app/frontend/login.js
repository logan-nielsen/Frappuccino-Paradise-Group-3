import * as React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

import './styles/App.css';

const root = ReactDOM.createRoot(document.getElementById('react-login-root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="accounts/login" element={<LoginPage />} />
        <Route path="accounts/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
  
