// Company Types and Interfaces

export interface CompanyAddress {
  latitude?: string;
  longitude?: string;
  CompanyState: string;
  CompanyCountry: string;
  CompanyCity: string;
  buildingNumber?: string;
  CompanyZIP: string;
  detailAdddress: string;
}

export interface UserData {
  userName: string;
  userEmail: string;
  userPassword: string;
  userMobile: string;
  userImage?: string;
  userRole?: string;
  userID?: string;
  companyId?: string;
  companyDomain?: string;
  companyType?: string;
  IsActive: boolean;
  createdBy?: string;
  createdOn?: string;
}

export interface AddCompanyRequest {
  CompanyName: string;
  CompanyLogo?: string;
  CompanyType: string;
  CompanyCurrency: string;
  CompanyIsActive: boolean;
  CompanyDomain: string;
  PAN_No: string;
  GST_NO: string;
  CIN_NO: string;
  IFSC_Code: string;
  plan_type: string;
  plan_rate: string;
  CID?: string;
  CreatedBy?: string;
  CompanyAddress: CompanyAddress;
  user: UserData;
  companyLogo?: File | null;
  userImg?: File | null;
}

export interface UpdateCompanyRequest extends AddCompanyRequest {
  CID: string; // CID is required for update
  user: UserData & {
    userID: string; // userID is required for update
  };
}

export interface AddCompanyResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface CompanyAddressResponse {
  buildingNumber?: string;
  detailAdddress: string;
  companyCountry: string;
  companyState: string;
  companyCity: string;
  companyZIP: string;
}

export interface Company {
  cid: string;
  companyName: string;
  companyType: string;
  companyLogo: string;
  companyDomain: string;
  companyCurrency: string;
  ifsC_Code: string;
  paN_No: string;
  gsT_NO: string;
  ciN_NO: string;
  companyIsActive: boolean;
  plan_type: string;
  plan_rate: string;
  createdBy: string;
  companyAddress: CompanyAddressResponse;
  user: any;
}

export interface GetCompanyListResponse {
  isSuccess: boolean;
  message: string;
  result: Company[];
}

export interface DeleteCompanyResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface GetCompanyByIdResponse {
  isSuccess: boolean;
  message: string;
  result: Company;
}

export interface UpdateCompanyResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface CompanyState {
  loading: boolean;
  error: string | null;
  success: boolean;
  companies: Company[];
  fetchLoading: boolean;
  fetchError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
  deleteSuccess: boolean;
  currentCompany: Company | null;
  fetchByIdLoading: boolean;
  fetchByIdError: string | null;
}
// Country-State API response ke liye
export interface State {
  stateId: string;
  stateName: string;
}

export interface CountryState {
  tblid: string;
  countryId: string;
  countryName: string;
  states: State[];
}

export interface GetCountryStateResponse {
  isSuccess: boolean;
  message: string;
  result: CountryState[];
}
