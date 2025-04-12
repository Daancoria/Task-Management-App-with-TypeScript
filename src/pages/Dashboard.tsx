import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import NavBar from '../components/NavBar';
import styles from '../styles/Dashboard.module.css';
import { Task } from '../types';

const getNextStatus = (status: Task['status']): Task['status'] => {
  switch (status) {
    case 'pending':
      return 'in-progress';
    case 'in-progress':
      return 'completed';
    default:
      return 'pending';
  }
};

const Dashboard: React.FC = () => {
  const { tasks, deleteTask, updateTask, clearAllTasks } = useTaskContext();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Task['status']>('all');
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'priority'>('createdAt');

  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())
    );

    if (filterStatus !== 'all') {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  }, [tasks, search, filterStatus, sortBy]);

  const handleToggleStatus = (task: Task) => {
    const nextStatus = getNextStatus(task.status);
    updateTask({ ...task, status: nextStatus, updatedAt: new Date().toISOString() });
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all tasks?')) {
      clearAllTasks();
    }
  };

  const isOverdue = (dueDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dueDate && dueDate < today;
  };

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Task Dashboard</h1>
          <Link to="/task/new" className={styles.button}>➕ New Task</Link>
          <button className={styles.clear} onClick={handleClearAll}>🧹 Clear All</button>
        </div>

        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.search}
          />

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="createdAt">Newest First</option>
            <option value="title">Title A–Z</option>
            <option value="priority">Priority</option>
          </select>
        </div>

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
                <button onClick={() => deleteTask(task.id)}>🗑 Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Dashboard;

