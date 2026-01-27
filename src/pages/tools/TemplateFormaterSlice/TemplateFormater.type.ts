export interface AddTemplateRequest {
  slipID: string;
  compID: string;
  compDomain: string;
  slipName: string;
  htmlTemplate: string;
  activityId: string;
  activityActName: string;
  stateName: string;
  createdOn: string;
  fileTye: string;
}

export interface AddTemplateResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}
export interface TemplateFormaterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string;
  templates: Template[];
  states: StateItem[];
  activities: CompanyActivity[];
  templateDetail?: AddTemplateRequest | null;
}
export interface Template {
  slipID: string;
  compID: string;
  compDomain: string;
  slipName: string;
  htmlTemplate: string;
  createdOn: string;
  stateName: string;
  activityActName: string;
  fileTye: string;
}
export interface GetTemplatesResponse {
  isSuccess: boolean;
  message: string;
  result: Template[];
}
// CountryState.type.ts
export interface StateItem {
  stateId: string;
  stateName: string;
}

export interface CountryItem {
  tblid: string;
  countryId: string;
  countryName: string;
  states: StateItem[];
}

export interface GetCountryStateResponse {
  isSuccess: boolean;
  message: string;
  result: CountryItem[];
}
export interface CompanyActivity {
  activityId: string;
  actName: string;
  activityName: string;
  departmentName: string;
  companyId: string;
  companyDomain: string;
}

export interface GetCompanyActivityResponse {
  isSuccess: boolean;
  message: string;
  result: CompanyActivity[];
}
export interface GetTemplateByIdResponse {
  isSuccess: boolean;
  message: string;
  result: AddTemplateRequest;
}
export interface UpdateTemplateResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}
export interface UpdateTemplateRequest {
  slipID: string;
  compID: string;
  activityId: string;
  activityActName: string;
  stateName: string;
  compDomain: string;
  slipName: string;
  htmlTemplate: string;
  createdOn: string;
  fileTye: string;
}
