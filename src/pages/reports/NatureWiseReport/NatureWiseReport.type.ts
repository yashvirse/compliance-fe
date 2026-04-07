/* ================= API RESPONSE ================= */

export interface NatureWiseReportApiResponse {
  isSuccess: boolean;
  message: string;
  result: NatureWiseReport[];
}

/* ================= MAIN TASK ================= */

export interface NatureWiseReport {
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
  natureOfActivity: string;
  details: NatureWiseReportDetail[];

  companyId: string;
  siteID: string | null;
  siteName: string | null;
  companyDomain: string;
  frequency: string;
  taskReport?: string[];
}

/* ================= TASK DETAILS (FLOW HISTORY) ================= */

export interface NatureWiseReportDetail {
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

export type NatureWiseReportStatus =
  | "Pending"
  | "Completed"
  | "Rejected"
  | "Approved";

export type NatureWiseReportActionStatus = "Pending" | "Approved" | "Rejected";
