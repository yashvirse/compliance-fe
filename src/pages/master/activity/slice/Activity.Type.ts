// Activity Master Types and Interfaces

// Frequency type constants
export const FrequencyType = {
  WEEKLY: 'Weekly',
  FORTNIGHTLY: 'Fortnightly',
  MONTHLY: 'Monthly',
  HALF_YEARLY: 'Half Yearly',
  ANNUALLY: 'Annually',
  AS_NEEDED: 'As Needed'
} as const;

export type FrequencyTypeValue = typeof FrequencyType[keyof typeof FrequencyType];

export interface ActivityMaster {
  activityId: string;
  actID: string;
  departmentID: string;
  activityName: string;
  description: string;
  frequency: FrequencyTypeValue;
  dueDay: number;
  gracePeriodDay: number;
  reminderDay: string;
  actName?: string; // For display purposes
  departmentName?: string; // For display purposes
  createdBy?: string;
  createdDate?: string;
  updatedAt?: string;
}

export interface FrequencyOption {
  value: FrequencyTypeValue;
  label: string;
  maxDueDay: number;
  description: string;
}

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { value: FrequencyType.WEEKLY, label: 'Weekly', maxDueDay: 7, description: 'Enter 1-7 (1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday, 7=Sunday)' },
  { value: FrequencyType.FORTNIGHTLY, label: 'Fortnightly', maxDueDay: 15, description: 'Enter day 1-15 of the fortnight' },
  { value: FrequencyType.MONTHLY, label: 'Monthly', maxDueDay: 31, description: 'Enter day 1-31 of the month' },
  { value: FrequencyType.HALF_YEARLY, label: 'Half Yearly', maxDueDay: 183, description: 'Enter day 1-183 of half year' },
  { value: FrequencyType.ANNUALLY, label: 'Annually', maxDueDay: 365, description: 'Enter day 1-365 of the year' },
  { value: FrequencyType.AS_NEEDED, label: 'As Needed', maxDueDay: 0, description: 'Exact date required' }
];

export interface AddActivityMasterRequest {
  activityId: string;
  actID: string;
  departmentID: string;
  activityName: string;
  description: string;
  frequency: string;
  dueDay: number;
  gracePeriodDay: number;
  reminderDay: string;
}

export interface AddActivityMasterResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface UpdateActivityMasterRequest {
  activityId: string;
  actID: string;
  departmentID: string;
  activityName: string;
  description: string;
  frequency: string;
  dueDay: number;
  gracePeriodDay: number;
  reminderDay: string;
}

export interface UpdateActivityMasterResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface GetActivityMasterListResponse {
  isSuccess: boolean;
  message: string;
  result: ActivityMaster[];
}

export interface GetActivityMasterByIdResponse {
  isSuccess: boolean;
  message: string;
  result: ActivityMaster;
}

export interface DeleteActivityMasterResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface DepartmentDropdownResponse {
  isSuccess: boolean;
  message: string;
  result: Record<string, string>; // { "id": "name" }
}

export interface ActivityMasterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  activityMasters: ActivityMaster[];
  deleteLoading: boolean;
  deleteError: string | null;
  deleteSuccess: boolean;
  currentActivityMaster: ActivityMaster | null;
  fetchByIdLoading: boolean;
  fetchByIdError: string | null;
  departmentDropdown: Record<string, string>;
  departmentDropdownLoading: boolean;
}
