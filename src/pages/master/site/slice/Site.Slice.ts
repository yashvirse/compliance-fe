import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { SiteState, Site } from './Site.Type';
import { apiService } from '../../../../services/api';



const initialState: SiteState = {
  sites: [],
  loading: false,
  error: null,
  successMessage: null,
};

// Fetch sites list
export const fetchSiteList = createAsyncThunk('site/fetchSiteList', async (_, { rejectWithValue }) => {
  try {
    // apiService.get already returns response.data, which has { isSuccess, message, result: [...] }
    const response = await apiService.get<any>(`Master/getSiteMasterList`);
    console.log('Site API Response (from apiService.get):', response);
    
    // response is already the parsed data: { isSuccess, message, result: [...] }
    const sitesArray = response?.result || [];
    console.log('Extracted Sites Array:', sitesArray);
    
    return sitesArray;
  } catch (error: any) {
    console.error('Error fetching sites:', error);
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch sites');
  }
});

// Add new site
export const addSite = createAsyncThunk(
  'site/addSite',
  async (siteData: Site, { rejectWithValue }) => {
    try {
      const response = await apiService.post(`Master/addSiteMaster`, siteData);
      // API returns { isSuccess, message, result: newSiteData }
      console.log('Add Site Response:', response);
      return response?.result || response;
    } catch (error: any) {
      console.error('Error adding site:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add site');
    }
  }
);

// Update site
export const updateSite = createAsyncThunk(
  'site/updateSite',
  async (siteData: Site, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`Master/editSiteMaster`, siteData);
      // API returns { isSuccess, message, result: updatedSiteData }
      console.log('Update Site Response:', response);
      return response?.result || response;
    } catch (error: any) {
      console.error('Error updating site:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update site');
    }
  }
);

// Delete site
export const deleteSite = createAsyncThunk(
  'site/deleteSite',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.delete(`Master/deleteSiteMaster/${id}`);
      // API returns { isSuccess, message, result: deletedSiteData or id }
      console.log('Delete Site Response:', response);
      return { siteId: id, ...response };
    } catch (error: any) {
      console.error('Error deleting site:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete site');
    }
  }
);

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch sites
    builder
      .addCase(fetchSiteList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiteList.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Fulfilled Payload (sites array):', action.payload);
        // action.payload is now just the sites array
        state.sites = Array.isArray(action.payload) ? action.payload : [];
        console.log('State sites after update:', state.sites);
      })
      .addCase(fetchSiteList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add site
    builder
      .addCase(addSite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSite.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload is already the site data (result extracted in thunk)
        const siteData = action.payload;
        if (siteData && typeof siteData === 'object' && siteData.siteId) {
          state.sites.push(siteData);
        }
        state.successMessage = 'Site added successfully';
      })
      .addCase(addSite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update site
    builder
      .addCase(updateSite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSite.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload is already the site data (result extracted in thunk)
        const siteData = action.payload;
        const index = state.sites.findIndex((site) => site.siteId === siteData.siteId);
        if (index !== -1 && siteData && typeof siteData === 'object') {
          state.sites[index] = siteData;
        }
        state.successMessage = 'Site updated successfully';
      })
      .addCase(updateSite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete site
    builder
      .addCase(deleteSite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSite.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted site from the sites array using the siteId we passed
        state.sites = state.sites.filter((site) => site.siteId !== action.payload.siteId);
        state.successMessage = 'Site deleted successfully';
      })
      .addCase(deleteSite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccessMessage } = siteSlice.actions;
export default siteSlice.reducer;
