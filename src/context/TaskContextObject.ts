import { createContext } from 'react';
import { Task } from '../types';

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (id: string) => void;
  clearAllTasks: () => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
