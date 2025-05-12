// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PomodoroTime from './pages/PomodoroTime';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PomodoroTime />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
