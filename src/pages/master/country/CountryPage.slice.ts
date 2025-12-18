import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { CountriesState, GetCountriesResponse } from "./CountryPage.type";
import { apiService } from "../../../services/api";

const initialState: CountriesState = {
  loading: false,
  error: null,
  countries: [],
};

// Async thunk for fetching country list
export const fetchCountryList = createAsyncThunk<
  GetCountriesResponse,
  void,
  { rejectValue: string }
>("country/fetchCountryList", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get<GetCountriesResponse>(
      "Master/getCountryState"
    );

    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Failed to fetch countries");
    }

    return response;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch countries"
    );
  }
});

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    clearCountryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountryList.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload.result || [];
      })
      .addCase(fetchCountryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearCountryError } = countrySlice.actions;
export default countrySlice.reducer;
