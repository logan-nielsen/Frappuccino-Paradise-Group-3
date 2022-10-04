import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";
  
  export default function App() {
    return (
      <>
      <Router>
        <p>Add nav component</p>
        <Routes>
          <Route path="/" element={<p>Add home component</p>} />
        </Routes>
      </Router>
      </>
    );
  }