import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../hooks/useTaskContext';

import NavBar from '../components/NavBar';
import styles from '../styles/Dashboard.module.css';
import { Task } from '../types';

// Helper function to get the next status of a task
const getNextStatus = (status: Task['status']): Task['status'] => {
  switch (status) {
    case 'pending': return 'in-progress';
    case 'in-progress': return 'completed';
    default: return 'pending';
  }
};

// Key for storing filter settings in localStorage
const FILTER_STORAGE_KEY = 'task-manager-filters';

const Dashboard: React.FC = () => {
  // Access task-related functions and data from context
  const { tasks, deleteTask, updateTask, clearAllTasks } = useTaskContext();

  // State variables for search, filters, and sorting
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Task['status']>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Task['priority']>('all');
  const [sortBy, setSortBy] = useState<'title-asc' | 'title-desc' | 'due-asc' | 'due-desc'>('due-desc');

  // Load saved filters from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setSearch(parsed.search || '');
      setDebouncedSearch(parsed.search || '');
      setFilterStatus(parsed.filterStatus || 'all');
      setPriorityFilter(parsed.priorityFilter || 'all');
      setSortBy(parsed.sortBy || 'due-desc');
    }
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      FILTER_STORAGE_KEY,
      JSON.stringify({ search, filterStatus, priorityFilter, sortBy })
    );
  }, [search, filterStatus, priorityFilter, sortBy]);

  // Debounce the search input to improve performance
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timeout);
  }, [search]);

  // Reset all filters to their default values
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setFilterStatus('all');
    setPriorityFilter('all');
    setSortBy('due-desc');
    localStorage.removeItem(FILTER_STORAGE_KEY);
    toast.success('Filters reset');
  };

  // Filter and sort tasks based on the current filters and search input
  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      task.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    if (filterStatus !== 'all') {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
      if (sortBy === 'due-asc') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (sortBy === 'due-desc') return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      return 0;
    });

    return filtered;
  }, [tasks, debouncedSearch, filterStatus, priorityFilter, sortBy]);

  // Toggle the status of a task to the next status
  const handleToggleStatus = (task: Task) => {
    const nextStatus = getNextStatus(task.status);
    updateTask({ ...task, status: nextStatus, updatedAt: new Date().toISOString() });
    toast.success(`Task status set to ${nextStatus}`);
  };

  // Delete a specific task
  const handleDelete = (id: string) => {
    deleteTask(id);
    toast.success('Task deleted');
  };

  // Clear all tasks after confirmation
  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all tasks?')) {
      clearAllTasks();
      toast.success('All tasks deleted');
    }
  };

  // Check if a task is overdue
  const isOverdue = (dueDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dueDate && dueDate < today;
  };

  return (
    <>
      {/* Navigation bar */}
      <NavBar />
      <div className={styles.container}>
        {/* Header with title and action buttons */}
        <div className={styles.header}>
          <h1 className={styles.title}>Task Dashboard</h1>
          <Link to="/task/new" className={styles.button}>➕ New Task</Link>
          <button className={`${styles.iconButton} ${styles.clear}`} onClick={handleClearAll}>
            🧹 Clear All
          </button>
        </div>

        {/* Controls for search, filters, and sorting */}
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.search}
          />

          <select
            value={filterStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFilterStatus(e.target.value as "all" | "pending" | "in-progress" | "completed")
            }
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setPriorityFilter(e.target.value as "all" | "high" | "medium" | "low")
            }
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSortBy(
                e.target.value as
                  | "title-asc"
                  | "title-desc"
                  | "due-asc"
                  | "due-desc"
              )
            }
          >
            <option value="title-asc">Title A–Z</option>
            <option value="title-desc">Title Z–A</option>
            <option value="due-asc">Due Date: Earliest</option>
            <option value="due-desc">Due Date: Latest</option>
          </select>

          <button className={styles.iconButton} onClick={handleResetFilters}>
            🔄 Reset Filters
          </button>
        </div>

        {/* Summary of filtered tasks */}
        <div className={styles.summary}>
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>

        {/* List of tasks */}
        <ul className={styles.taskList}>
          {filteredTasks.map((task) => (
            <li key={task.id} className={styles.taskItem}>
              <div>
                <Link to={`/task/${task.id}`} className={styles.taskTitle}>
                  {task.title}
                </Link>
                <div className={styles.meta}>
                  <span>Status: {task.status}</span> | 
                  <span>
                    Priority:
                    <span className={`${styles.priority} ${styles['priority-' + task.priority]}`}>
                      {task.priority}
                    </span>
                  </span>
                  <span className={isOverdue(task.dueDate) ? styles.overdue : ''}>
                    Due: {task.dueDate || '—'}
                  </span>
                </div>
              </div>
              <div className={styles.actions}>
                <button onClick={() => handleToggleStatus(task)}>🔁 Next</button>
                <button onClick={() => handleDelete(task.id)}>🗑 Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Dashboard;
