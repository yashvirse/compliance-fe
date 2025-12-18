export interface State {
  stateId: string;
  stateName: string;
}

export interface Country {
  countryId: string;
  countryName: string;
  tblid?: string;
  states?: State[];
}

export interface GetCountriesResponse {
  isSuccess: boolean;
  message: string;
  result: Country[];
}

export interface CountriesState {
  loading: boolean;
  error: string | null;
  countries: Country[];
}
