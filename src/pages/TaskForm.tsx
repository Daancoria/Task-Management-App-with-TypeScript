import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import { Task, Subtask, Recurrence } from '../types';
import { v4 as uuidv4 } from 'uuid';
import NavBar from '../components/NavBar';
import styles from '../styles/TaskForm.module.css';

const TaskForm: React.FC = () => {
  // Extract the task ID from the URL parameters
  const { id } = useParams();

  // React Router hook for navigation
  const navigate = useNavigate();

  // Access tasks and task-related functions from the TaskContext
  const { tasks, addTask, updateTask } = useTaskContext();

  // Find the existing task if the ID is provided (for editing)
  const existingTask = tasks.find((t) => t.id === id);

  // State variables for task fields
  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [status, setStatus] = useState<Task['status']>(existingTask?.status || 'pending');
  const [priority, setPriority] = useState<Task['priority']>(existingTask?.priority || 'medium');
  const [dueDate, setDueDate] = useState(existingTask?.dueDate || '');
  const [recurrence, setRecurrence] = useState<Recurrence>(existingTask?.recurrence || 'none');
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState<number>(existingTask?.reminderMinutesBefore || 0);
  const [estimatedTimeMinutes, setEstimatedTimeMinutes] = useState<number>(existingTask?.estimatedTimeMinutes || 0);
  const [notes, setNotes] = useState(existingTask?.notes || '');
  const [subtasks, setSubtasks] = useState<Subtask[]>(existingTask?.subtasks || []);

  // Add a new subtask to the list
  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: uuidv4(), title: '', completed: false }]);
  };

  // Update a specific field of a subtask
  const handleSubtaskChange = (index: number, field: 'title' | 'completed', value: string | boolean) => {
    const newSubtasks = [...subtasks];
    (newSubtasks[index] as any)[field] = value;
    setSubtasks(newSubtasks);
  };

  // Remove a subtask from the list
  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  // Handle form submission to save or update the task
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();

    // Prepare the task data
    const taskData: Task = {
      id: existingTask?.id || uuidv4(),
      title,
      description,
      status,
      priority,
      dueDate,
      createdAt: existingTask?.createdAt || now,
      updatedAt: now,
      recurrence,
      reminderMinutesBefore,
      estimatedTimeMinutes,
      notes,
      subtasks,
    };

    // Update the task if it exists, otherwise add a new task
    if (existingTask) {
      updateTask(taskData);
    } else {
      addTask(taskData);
    }

    // Navigate back to the dashboard
    navigate('/');
  };

  return (
    <>
      {/* Navigation bar */}
      <NavBar />

      {/* Task form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>{existingTask ? 'Edit Task' : 'Create Task'}</h1>

        {/* Title input */}
        <label>Title:</label>
        <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} required />

        {/* Description input */}
        <label>Description:</label>
        <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} required />

        {/* Status dropdown */}
        <label>Status:</label>
        <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value as Task['status'])}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority dropdown */}
        <label>Priority:</label>
        <select className={styles.select} value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])}>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>

        {/* Due date input */}
        <label>Due Date:</label>
        <input type="date" className={styles.input} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

        {/* Recurrence dropdown */}
        <label>Recurrence:</label>
        <select className={styles.select} value={recurrence} onChange={(e) => setRecurrence(e.target.value as Recurrence)}>
          <option value="none">Does not repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        {/* Reminder input */}
        <label>Reminder (minutes before due):</label>
        <input
          type="number"
          className={styles.input}
          placeholder="e.g. 15"
          value={reminderMinutesBefore}
          onChange={(e) => setReminderMinutesBefore(parseInt(e.target.value) || 0)}
        />

        {/* Estimated time input */}
        <label>Estimated Time (minutes):</label>
        <input
          type="number"
          className={styles.input}
          placeholder="e.g. 60"
          value={estimatedTimeMinutes}
          onChange={(e) => setEstimatedTimeMinutes(parseInt(e.target.value) || 0)}
        />

        {/* Notes input */}
        <label>Notes (optional):</label>
        <textarea
          className={styles.textarea}
          placeholder="Add any extra info here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Subtasks section */}
        <div style={{ marginTop: '1rem' }}>
          <h3>Subtasks</h3>
          {subtasks.map((subtask, index) => (
            <div key={subtask.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                className={styles.input}
                placeholder="Subtask title"
                value={subtask.title}
                onChange={(e) => handleSubtaskChange(index, 'title', e.target.value)}
              />
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={(e) => handleSubtaskChange(index, 'completed', e.target.checked)}
                style={{ marginLeft: '0.5rem' }}
              />
              <button type="button" onClick={() => handleRemoveSubtask(index)} style={{ marginLeft: '0.5rem' }}>🗑</button>
            </div>
          ))}
          <button type="button" onClick={handleAddSubtask} className={styles.button}>+ Add Subtask</button>
        </div>

        {/* Submit button */}
        <button type="submit" className={styles.button}>Save</button>
      </form>
    </>
  );
};

export default TaskForm;
