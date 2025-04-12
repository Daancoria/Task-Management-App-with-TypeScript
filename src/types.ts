export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
  }
  
  export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
  
  export interface Task {
    id: string;
    title: string;
    description: string;
    notes?: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    recurrence?: Recurrence;
    subtasks?: Subtask[];
    reminderMinutesBefore?: number;    // For browser notifications
    estimatedTimeMinutes?: number;     // e.g. 90 means 1h30m
    actualTimeMinutes?: number;        // Optional field for timer-based time tracking
  }
  