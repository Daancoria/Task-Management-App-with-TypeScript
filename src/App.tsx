import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';
import TaskDetails from './pages/TaskDetails';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';

import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/task/new" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
        <Route path="/task/:id/edit" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
        <Route path="/task/:id" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
