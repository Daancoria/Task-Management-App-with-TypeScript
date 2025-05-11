import { createContext } from 'react';
import { Task } from '../types';
import { User } from '@auth0/auth0-react';

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (id: string) => void;
  clearAllTasks: () => void;
  currentUser: User | null; // ✅ Auth0 user type
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
