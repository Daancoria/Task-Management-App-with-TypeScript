import { useState, useEffect, ReactNode } from 'react';
import { Task } from '../types';
import { TaskContext } from './TaskContextObject';


const STORAGE_KEY = 'task-manager-tasks';

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Task) => setTasks((prev) => [...prev, task]);

  const updateTask = (updatedTask: Task) =>
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );

  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((task) => task.id !== id));

  const clearAllTasks = () => setTasks([]);

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTask, deleteTask, clearAllTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
};
