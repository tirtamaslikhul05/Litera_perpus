import { useState } from 'react'
import { BrowserRouter as Router , Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Auth/login';
import Register from './views/Auth/register';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}