import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Task } from '../types';
import styles from '../styles/TaskModal.module.css';
import { v4 as uuidv4 } from 'uuid';

interface TaskModalProps {
  onClose: () => void;
  defaultDate?: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ onClose, defaultDate }) => {
  const { addTask } = useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('pending');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [reminder, setReminder] = useState(0);
  const [estimate, setEstimate] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();

    addTask({
      id: uuidv4(),
      title,
      description,
      status,
      priority,
      dueDate,
      createdAt: now,
      updatedAt: now,
      reminderMinutesBefore: reminder,
      estimatedTimeMinutes: estimate,
      notes,
    });

    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Create Task</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="desc">Description:</label>
          <textarea
            id="desc"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label htmlFor="due">Due Date:</label>
          <input
            id="due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Task['status'])}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <label htmlFor="priority">Priority:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task['priority'])}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>

          <label htmlFor="reminder">Reminder (minutes before due date):</label>
          <input
            id="reminder"
            type="number"
            min="0"
            placeholder="e.g. 15"
            value={reminder}
            onChange={(e) => setReminder(parseInt(e.target.value) || 0)}
          />

          <label htmlFor="estimate">Estimated Time (minutes):</label>
          <input
            id="estimate"
            type="number"
            min="0"
            placeholder="e.g. 60"
            value={estimate}
            onChange={(e) => setEstimate(parseInt(e.target.value) || 0)}
          />

          <label htmlFor="notes">Notes (optional):</label>
          <textarea
            id="notes"
            placeholder="Add any extra information..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className={styles.actions}>
            <button type="submit">Add Task</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
