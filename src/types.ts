export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface UserProject {
    userId: string;
    projectId: string;
    role: 'owner' | 'member';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  lastUpdated: Date;
  dueDate?: Date;
  assignedTo?: string; // userId
  projectId: string;
}

export interface Comment {
  id: string;
  body: string;
  taskId: string;
  userId: string;
  createdAt: Date;
}
