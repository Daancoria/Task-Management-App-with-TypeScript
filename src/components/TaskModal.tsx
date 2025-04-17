import React, { useState, useEffect, useRef } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Task } from '../types';
import styles from '../styles/TaskModal.module.css';
import { v4 as uuidv4 } from 'uuid';

// Props for the TaskModal component
interface TaskModalProps {
  onClose: () => void; // Function to close the modal
  defaultDate?: string; // Optional default due date
}

const TaskModal: React.FC<TaskModalProps> = ({ onClose, defaultDate }) => {
  // Access the addTask function from the TaskContext
  const { addTask } = useTaskContext();

  // State variables for task fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('pending');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [reminder, setReminder] = useState(0);
  const [estimate, setEstimate] = useState(0);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  // Refs for focusing the title input and detecting outside clicks
  const titleRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Effect to handle focus and keyboard/mouse events
  useEffect(() => {
    // Focus the title input when the modal opens
    titleRef.current?.focus();

    // Close the modal when the Escape key is pressed
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Close the modal when clicking outside of it
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        onClose();
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form fields
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';

    // If there are validation errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create a new task object
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

    // Close the modal after adding the task
    onClose();
  };

  return (
    <div className={styles.modalOverlay} ref={overlayRef}>
      <div className={styles.modal}>
        <h2>Create Task</h2>
        <form onSubmit={handleSubmit}>
          {/* Title input */}
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            ref={titleRef}
            className={errors.title ? styles.inputError : undefined}
          />
          {errors.title && <div className={styles.errorText}>{errors.title}</div>}

          {/* Description input */}
          <label htmlFor="desc">Description:</label>
          <textarea
            id="desc"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={errors.description ? styles.inputError : undefined}
          />
          {errors.description && <div className={styles.errorText}>{errors.description}</div>}

          {/* Due date input */}
          <label htmlFor="due">Due Date:</label>
          <input
            id="due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          {/* Status dropdown */}
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

          {/* Priority dropdown */}
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

          {/* Reminder input */}
          <label htmlFor="reminder">Reminder (minutes before due date):</label>
          <input
            id="reminder"
            type="number"
            min="0"
            placeholder="e.g. 15"
            value={reminder}
            onChange={(e) => setReminder(parseInt(e.target.value) || 0)}
          />

          {/* Estimated time input */}
          <label htmlFor="estimate">Estimated Time (minutes):</label>
          <input
            id="estimate"
            type="number"
            min="0"
            placeholder="e.g. 60"
            value={estimate}
            onChange={(e) => setEstimate(parseInt(e.target.value) || 0)}
          />

          {/* Notes input */}
          <label htmlFor="notes">Notes (optional):</label>
          <textarea
            id="notes"
            placeholder="Add any extra information..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* Action buttons */}
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

