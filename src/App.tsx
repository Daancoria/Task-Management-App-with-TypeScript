import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';
import TaskDetails from './pages/TaskDetails';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';

import PrivateRoute from './components/PrivateRoute';

import './styles/App.css'; // ✅ Add responsive CSS here

function URLHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const quickTask = params.get('quickTask');
    if (quickTask) {
      const taskData = {
        title: quickTask,
        description: params.get('description') || '',
        status: params.get('status') || 'pending',
        priority: params.get('priority') || 'medium',
        dueDate: params.get('due') || '',
        reminderMinutesBefore: parseInt(params.get('reminder') || '0'),
        estimatedTimeMinutes: parseInt(params.get('estimate') || '0'),
        notes: params.get('notes') || '',
      };
      localStorage.setItem('prefillTaskData', JSON.stringify(taskData));
      navigate('/task/new');
    }
  }, [location, navigate]);

  return null;
}

function App() {
  return (
    <>
      <Router>
        <URLHandler />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/task/new" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
          <Route path="/task/:id/edit" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
          <Route path="/task/:id" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
        </Routes>
      </Router>

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
