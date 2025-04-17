import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';
import TaskDetails from './pages/TaskDetails';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';

import PrivateRoute from './components/PrivateRoute';

// Main App component
function App() {
  return (
    <>
      {/* Router to handle navigation between pages */}
      <Router>
        <Routes>
          {/* Public route for the login page */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Private routes protected by the PrivateRoute component */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/task/new" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
          <Route path="/task/:id/edit" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
          <Route path="/task/:id" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
        </Routes>
      </Router>

      {/* Toaster for displaying notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
