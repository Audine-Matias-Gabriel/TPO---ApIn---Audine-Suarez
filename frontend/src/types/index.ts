import type { ReactNode } from 'react';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Project type
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

// Task type
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate?: string;
  createdAt: string;
  lastUpdated?: string;
  assignedTo?: User;
  project: Project;
}

// Comment type
export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  author: User;
  task: Task;
}

// UserProject association type
export interface UserProject {
  id: string;
  user: User;
  project: Project;
  role: 'owner' | 'member';
}

// Re-export ReactNode for convenience
export type { ReactNode };
