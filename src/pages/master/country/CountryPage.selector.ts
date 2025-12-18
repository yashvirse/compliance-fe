import type { RootState } from "../../../app/store";

// selector
export const selectCountries = (state: RootState) => state.country.countries;
export const selectCountriesLoading = (state: RootState) =>
  state.country.loading;
export const selectCountriesError = (state: RootState) => state.country.error;
