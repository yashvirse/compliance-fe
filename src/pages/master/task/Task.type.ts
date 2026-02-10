/* ================= API RESPONSE ================= */

export interface TaskApiResponse {
  isSuccess: boolean;
  message: string;
  result: Task[];
}

/* ================= MAIN TASK ================= */

export interface Task {
  tblId: string;
  activityId: string;
  actName: string;
  departmentName: string;
  activityName: string;
  description: string;

  dueDate: string; // ISO Date
  gracePeriodDate: string; // ISO Date
  reminderDate: string; // ISO Date

  currentUserID: string | null;
  currentUserName: string | null;
  currentUserInDate: string;

  maker: string;
  makerID: string;

  checker: string;
  checkerID: string;

  reviewer: string;
  reviewerID: string;

  auditer: string;
  auditerID: string;

  taskCreationDate: string;
  taskCurrentStatus: string;

  details: TaskDetail[];

  companyId: string;
  siteID: string | null;
  siteName: string | null;
  companyDomain: string;
  frequency: string;
}

/* ================= TASK DETAILS (FLOW HISTORY) ================= */

export interface TaskDetail {
  userId: string;
  userName: string;

  inDate: string;
  outDate: string;

  status: string;
  remarks: string;
  rejectionRemark: string;

  pTat: number;
  aTat: number;
}

/* ================= ENUMS ================= */

export type TaskStatus = "Pending" | "Completed" | "Rejected" | "Approved";

export type TaskActionStatus = "Pending" | "Approved" | "Rejected";
