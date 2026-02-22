// Muster Roll Record (Single Employee Record)
export interface IMusterRollRecord {
  payDate: string; // ISO Date string
  company_Code: string;
  company_Name: string;
  site_Code: string;
  site_Name: string;
  emp_Code: string;
  emp_Name: string;
  gender: string;
  appointment_Date: string;
  work_Nature: string;
  opening_Time: string;
  lunch_Time: string;
  closing_Time: string;
  noticeDate_UnderSection6: string;
  descharge_Dismissal_Date: string;
  delivery_Or_MiscarrageDate: string;
  medical_Bonus_Ammount: number;
  maternaty_StartDate: string;
  maternaty_EndDate: string;

  // Attendance Days (1–31)
  day_1: string;
  day_2: string;
  day_3: string;
  day_4: string;
  day_5: string;
  day_6: string;
  day_7: string;
  day_8: string;
  day_9: string;
  day_10: string;
  day_11: string;
  day_12: string;
  day_13: string;
  day_14: string;
  day_15: string;
  day_16: string;
  day_17: string;
  day_18: string;
  day_19: string;
  day_20: string;
  day_21: string;
  day_22: string;
  day_23: string;
  day_24: string;
  day_25: string;
  day_26: string;
  day_27: string;
  day_28: string;
  day_29: string;
  day_30: string;
  day_31: string;
}

// Main API Request Model
export interface IMusterRollRequest {
  month: number;
  year: number;
  musterRollRecords: IMusterRollRecord[];
}
export interface IMusterRollThunkPayload {
  data: IMusterRollRequest;
  apiKey: string;
  apiUrl: string;
}
// Single Salary Record
export interface ISalaryRecord {
  company_Name: string;
  site_Name: string;
  site_ID: string;
  site_Location: string;
  site_State: string;

  "Emp_No.": string;
  emp_Name: string;
  emp_DOB: string;
  emp_Joining_Dt: string;
  group_DOJ: string;
  emp_Leaving_Dt: string;

  division: string;
  department: string;
  sub_Department: string;
  designation: string;

  bankName: string;
  "Bank_Account_No.": string;
  ifsC_Code: string;
  payment_Mode: string;

  "Pan_No.": string;
  pension_No: string;
  uan: string;
  email_Id: string;

  days: number;
  lop: number;

  basic: number;
  hra: number;
  supp_Allowence: number;
  bonus: number;
  ltA_Allowence: number;

  "Books_&_Periodicals": number;
  "Tel_&_Internet": number;
  attire: number;
  "Petrol_&_Car": number;

  incentive: number;
  retention_Pay: number;
  fixed_Retention_Bonus: number;

  gross_Pay: number;

  income_Tax: number;
  pf: number;
  pF_Tax: number;
  esic: number;
  misc_Deduction: number;
  salary_Advance: number;
  gym_Fees: number;
  hols_Salary: number;
  pF_Misc: number;
  personal_Loan_Principal: number;
  personal_Loan_Interest: number;

  total_Deduction: number;
  net_Pay: number;
}

// Main Salary Register Request
export interface ISalaryRegisterRequest {
  month: number;
  year: number;
  salaryRecords: ISalaryRecord[];
}
export interface ISalaryRegisterThunkPayload {
  data: ISalaryRegisterRequest;
  apiKey: string;
  apiUrl: string;
}
