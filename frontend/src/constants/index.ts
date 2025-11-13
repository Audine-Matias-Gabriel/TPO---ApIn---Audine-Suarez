// API configuration constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Task statuses
export const TASK_STATUSES = ['pending', 'in_progress', 'completed', 'cancelled'] as const;

// User Project roles
export const USER_PROJECT_ROLES = ['owner', 'member'] as const;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;
