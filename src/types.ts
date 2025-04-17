// Define the structure of a Subtask
export interface Subtask {
    id: string;       // Unique identifier for the subtask
    title: string;    // Title or name of the subtask
    completed: boolean; // Indicates whether the subtask is completed
}

// Define the possible recurrence options for a task
export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

// Define the structure of a Task
export interface Task {
    id: string;                     // Unique identifier for the task
    title: string;                  // Title or name of the task
    description: string;            // Detailed description of the task
    notes?: string;                 // Optional field for additional notes
    status: 'pending' | 'in-progress' | 'completed'; // Current status of the task
    priority: 'low' | 'medium' | 'high'; // Priority level of the task
    dueDate: string;                // Due date for the task in ISO format
    createdAt: string;              // Timestamp when the task was created
    updatedAt: string;              // Timestamp when the task was last updated
    recurrence?: Recurrence;        // Optional field for recurrence settings
    subtasks?: Subtask[];           // Optional list of subtasks associated with the task
    reminderMinutesBefore?: number; // Optional field for reminder notifications (in minutes)
    estimatedTimeMinutes?: number;  // Optional field for estimated time to complete the task (in minutes)
    actualTimeMinutes?: number;     // Optional field for actual time spent on the task (in minutes)
}
