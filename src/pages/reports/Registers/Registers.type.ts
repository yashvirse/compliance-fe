export interface IRegister {
  reportId: string;
  companyID: string;
  reportName: string;
  reportMonth: string;
  reportYear: string;
  siteState: string;
  siteName: string;
  reportRelatedActivityName: string;
  reportRelatedActivityID: string;
  reportPath: string;
  createdOn: string;
}

export interface IRegisterResponse {
  isSuccess: boolean;
  message: string;
  result: IRegister[];
}
