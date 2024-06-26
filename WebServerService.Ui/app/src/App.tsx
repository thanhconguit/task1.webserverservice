// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AppHeader from './components/Header';
import Events from './components/Events';
import Users from './components/Users';
import Roles from './components/Roles';

const App: React.FC = () => {
  return (
    <Router>
      <AppHeader />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<Events />} />
        <Route path="/user" element={<Users />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
