// ScoreCard.type.ts

/** ================= API ROOT ================= */

export interface ScoreCardResponse {
  isSuccess: boolean;
  message: string;
  result: CompanyReport;
}

/** ================= COMPANY LEVEL ================= */

export interface CompanyReport {
  companyId: string;
  companyName: string;
  average: number;
  sites: SiteReport[];
}

/** ================= SITE LEVEL ================= */

export interface SiteReport {
  siteId: string;
  siteName: string;
  average: number;
  acts: ActReport[];
}

/** ================= ACT LEVEL ================= */

export interface ActReport {
  actName: string;
  average: number;
  activities: ActivityReport[];
}

/** ================= ACTIVITY / TABLE ROW ================= */

export interface ActivityReport {
  tblId: string;
  companyName: string;
  siteName: string;
  actName: string;
  activityName: string;
  pe: number;
  percentage: number;
  dueDate: string; // ISO string from API
  status: string;
}
export interface ScoreCardState {
  data: any;
  loading: boolean;
  error: string | null;
  report: CompanyReport | null;
  departments: Department[];
  sites: Site[];
}
export interface Department {
  deptId: string;
  departmentName: string;
}

export interface DepartmentResponse {
  isSuccess: boolean;
  message: string;
  result: Department[];
}
export interface Site {
  siteId: string;
  siteName: string;
}

export interface SiteResponse {
  isSuccess: boolean;
  message: string;
  result: Site[];
}
