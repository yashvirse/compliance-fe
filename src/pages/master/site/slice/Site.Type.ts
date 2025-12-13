export interface DefaultUser {
  defaultMaker: string;
  defaultMakerId: string;
  defaultChecker: string;
  defaultCheckerId: string;
  defaultReviewer: string;
  defaultReviewerId: string;
  defaultAuditer: string;
  defaultAuditerId: string;
}

export interface Site {
  siteId?: string;
  siteName: string;
  companyId: string;
  compnanyDomain: string;
  description: string;
  siteLocation: string;
  state: string;
  country: string;
  defaultUser: DefaultUser;
  createdDate?: string;
  updatedDate?: string;
}

export interface SiteState {
  sites: Site[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}
