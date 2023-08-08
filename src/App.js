import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </Router>
  );
}

export default App;
