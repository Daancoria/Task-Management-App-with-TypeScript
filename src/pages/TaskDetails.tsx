import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import NavBar from '../components/NavBar';
import styles from '../styles/TaskDetails.module.css';

const TaskDetails: React.FC = () => {
  const { id } = useParams();
  const { tasks } = useTaskContext();

  const task = tasks.find((t) => t.id === id);
  if (!task) return <div className={styles.container}>Task not found</div>;

  const isOverdue = (dueDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dueDate && dueDate < today;
  };

  const formatMinutes = (minutes?: number) => {
    if (!minutes) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <h1 className={styles.title}>{task.title}</h1>
        <p>{task.description}</p>

        <p className={styles.meta}>Status: {task.status}</p>
        <p className={styles.meta}>Priority: {task.priority}</p>
        <p className={`${styles.meta} ${isOverdue(task.dueDate) ? styles.overdue : ''}`}>
          Due Date: {task.dueDate || '—'}
        </p>
        <p className={styles.meta}>Recurrence: {task.recurrence || 'none'}</p>
        <p className={styles.meta}>Reminder: {task.reminderMinutesBefore || 0} minutes before</p>
        <p className={styles.meta}>Estimated Time: {formatMinutes(task.estimatedTimeMinutes)}</p>
        <p className={styles.meta}>Actual Time: {formatMinutes(task.actualTimeMinutes)}</p>

        {task.notes && (
          <>
            <h3 style={{ marginTop: '1.5rem' }}>Notes</h3>
            <p>{task.notes}</p>
          </>
        )}

        {task.subtasks && task.subtasks.length > 0 && (
          <>
            <h3 style={{ marginTop: '1.5rem' }}>Subtasks</h3>
            <ul>
              {task.subtasks.map((sub) => (
                <li key={sub.id}>
                  <input type="checkbox" checked={sub.completed} readOnly /> {sub.title}
                </li>
              ))}
            </ul>
          </>
        )}

        <Link to={`/task/${task.id}/edit`} className={styles.link}>
          ✏️ Edit Task
        </Link>
      </div>
    </>
  );
};

export default TaskDetails;
