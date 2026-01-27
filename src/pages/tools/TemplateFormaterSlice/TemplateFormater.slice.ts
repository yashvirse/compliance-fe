import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  AddTemplateRequest,
  AddTemplateResponse,
  CompanyActivity,
  GetCompanyActivityResponse,
  GetCountryStateResponse,
  GetTemplateByIdResponse,
  GetTemplatesResponse,
  StateItem,
  Template,
  TemplateFormaterState,
  UpdateTemplateRequest,
  UpdateTemplateResponse,
} from "./TemplateFormater.type";
import { apiService } from "../../../services/api";

// Initial State
const initialState: TemplateFormaterState = {
  loading: false,
  error: null,
  success: false,
  templates: [],
  states: [],
  activities: [],
  templateDetail: null,
  message: "",
};

export const addTemplate = createAsyncThunk<
  AddTemplateResponse,
  AddTemplateRequest,
  { rejectValue: string }
>("templateFormater/addTemplate", async (templateData, { rejectWithValue }) => {
  try {
    const response = await apiService.post<AddTemplateResponse>(
      "SalaryMusterRoll/AddTemplate",
      templateData
    );

    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Failed to add template");
    }

    return response;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to add template. Please try again."
    );
  }
});
export const getTemplates = createAsyncThunk<
  Template[],
  void,
  { rejectValue: string }
>("templateFormater/getTemplates", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get<GetTemplatesResponse>(
      "SalaryMusterRoll/GetTemplates"
    );

    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Failed to fetch templates");
    }

    return response.result;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch templates. Please try again."
    );
  }
});
export const getIndiaStates = createAsyncThunk<
  StateItem[],
  void,
  { rejectValue: string }
>("templateFormater/getIndiaStates", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get<GetCountryStateResponse>(
      "Master/getCountryState"
    );

    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Failed to fetch states");
    }
    const india = response.result.find((item) => item.countryId === "IND");
    return india?.states || [];
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch India states"
    );
  }
});
export const getCompanyActivities = createAsyncThunk<
  CompanyActivity[],
  string,
  { rejectValue: string }
>(
  "templateFormater/getCompanyActivities",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetCompanyActivityResponse>(
        `CompanyActivityMaster/getCompActivityMasterList/${companyId}`
      );
      if (!response.isSuccess) {
        return rejectWithValue(
          response.message || "Failed to fetch activities"
        );
      }
      return response.result;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch activities"
      );
    }
  }
);
// Async thunk for fetching template by ID
export const fetchTemplateById = createAsyncThunk<
  GetTemplateByIdResponse,
  string,
  { rejectValue: string }
>(
  "templateFormater/fetchTemplateById",
  async (templateId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetTemplateByIdResponse>(
        `SalaryMusterRoll/GetTemplateByID?tempID=${templateId}`
      );
      if (!response.isSuccess) {
        return rejectWithValue(
          response.message || "Failed to fetch Template details"
        );
      }
      return response;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch Template details. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);
// Async thunk for updating template
export const updateTemplateMaster = createAsyncThunk<
  UpdateTemplateResponse,
  UpdateTemplateRequest,
  { rejectValue: string }
>(
  "templateFormatter/updateTemplateFormatter",
  async (templateData: UpdateTemplateRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.put<UpdateTemplateResponse>(
        "SalaryMusterRoll/EditTemplate",
        templateData
      );

      if (!response.isSuccess) {
        return rejectWithValue(
          response.message || "Failed to update template "
        );
      }

      return response;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update Template . Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

const templateFormaterSlice = createSlice({
  name: "templateFormater",
  initialState,
  reducers: {
    clearTemplateError: (state) => {
      state.error = null;
    },
    clearTemplateSuccess: (state) => {
      state.message = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Template added successfully"; // ← new
      })
      .addCase(addTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "An error occurred while adding template";
      })
      .addCase(getTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(getTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "An error occurred while fetching templates";
      })
      .addCase(getIndiaStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIndiaStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload;
      })
      .addCase(getIndiaStates.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "An error occurred while fetching states";
      })
      .addCase(getCompanyActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(getCompanyActivities.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "An error occurred while fetching activities";
      })
      .addCase(fetchTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.templateDetail = action.payload.result;
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch template details";
      })
      .addCase(updateTemplateMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTemplateMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload.message || "Template updated successfully"; // ← new
      })
      .addCase(updateTemplateMaster.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "An error occurred while updating template";
      });
  },
});

export const { clearTemplateError, clearTemplateSuccess } =
  templateFormaterSlice.actions;

export default templateFormaterSlice.reducer;
