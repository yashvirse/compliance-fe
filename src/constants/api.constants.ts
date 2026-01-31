/**
 * API Constants - Centralized endpoint and cache key definitions
 * Benefits: Single source of truth, easy to maintain, prevents typos
 */

export const API_ENDPOINTS = {
  // Dashboard endpoints
  TASK_COUNT: 'Dashboard/getTaskCount',
  PENDING_TASKS: 'Dashboard/getPendingTaskDtl',
  APPROVED_TASKS: 'Dashboard/getApprovedTaskDtl',
  REJECTED_TASKS: 'Dashboard/getRejectedTaskDtl',
  ASSIGNED_TASKS: 'Dashboard/getAssignedTask',
  
  // Task actions
  APPROVE_TASK: 'Dashboard/approveTask',
  REJECT_TASK: 'Dashboard/rejectTask',
  
  // Master data
  USER_LIST: 'User/getUserList',
  COMPANY_LIST: 'CompanyMaster/getCompList',
  ACT_LIST: 'Master/getActMasterList',
  DEPARTMENT_LIST: 'Master/getDeptMasterList',
  ACTIVITY_LIST: 'Master/getActivityMasterList',
  SITE_LIST: 'Master/getSiteMasterList',
  COUNTRY_STATE: 'Master/getCountryState',
} as const;

export const CACHE_KEYS = {
  // Pending tasks
  PENDING_TASKS: (userId: string) => `pending_tasks_${userId}`,
  
  // Approved tasks
  APPROVED_TASKS: (userId: string) => `approved_tasks_${userId}`,
  
  // Rejected tasks
  REJECTED_TASKS: (userId: string) => `rejected_tasks_${userId}`,
  
  // Task counts
  TASK_COUNT: (userId: string) => `task_count_${userId}`,
  
  // Master data
  USER_LIST: 'user_list',
  COMPANY_LIST: 'company_list',
  ACT_LIST: 'act_list',
  DEPARTMENT_LIST: 'department_list',
  ACTIVITY_LIST: 'activity_list',
  SITE_LIST: 'site_list',
  COUNTRY_STATE: 'country_state',
} as const;

export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000, // 2 minutes
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
} as const;

export const TOAST_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  ERROR: 'Something went wrong. Please try again.',
  APPROVE_SUCCESS: 'Task approved successfully',
  REJECT_SUCCESS: 'Task rejected successfully',
  LOADING: 'Loading...',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;
