import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Container } from '@mui/system';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'

import './styles/App.css';

const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('react-login-root'));
root.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider theme={theme}>
        <Container component="main">
          <CssBaseline />
          <Routes>
            <Route path="accounts/login" element={<LoginPage />} />
            <Route path="accounts/signup" element={<SignUpPage />} />
          </Routes>
        </Container>
      </ThemeProvider>  
    </Router>
  </React.StrictMode>
);
  
