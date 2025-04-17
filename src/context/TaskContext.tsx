import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../types';

// Define the shape of the TaskContext
interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (id: string) => void;
  clearAllTasks: () => void;
}

// Create the TaskContext with an undefined default value
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Key for storing tasks in localStorage
const STORAGE_KEY = 'task-manager-tasks';

// TaskProvider component to wrap the application and provide task-related state and functions
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  // State to hold the list of tasks, initialized from localStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Effect to save tasks to localStorage whenever the tasks state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Function to add a new task to the list
  const addTask = (task: Task) => setTasks((prev) => [...prev, task]);

  // Function to update an existing task in the list
  const updateTask = (updatedTask: Task) =>
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)));

  // Function to delete a task by its ID
  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((task) => task.id !== id));

  // Function to clear all tasks
  const clearAllTasks = () => setTasks([]);

  // Provide the task-related state and functions to the children components
  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, clearAllTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to access the TaskContext
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTaskContext must be used within a TaskProvider');
  return context;
};

